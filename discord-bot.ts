import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { fetchPlayerData } from 'criticalops-api';

// Mock Databases
const linkedAccounts = new Map<string, any>(); // Discord ID -> Player Data
const playerStats = new Map<string, any>(); // Account ID -> Stats

// C-OPS API Base
const COPS_API_BASE = 'https://api-cops.criticalforce.fi/public';

const MAP_IMAGES: Record<string, string> = {
  'Raid': 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/raid.jpg',
  'Bureau': 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/bureau.jpg',
  'Canals': 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/canals.jpg',
  'Coalition': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Coalition+Map',
  'Grounded': 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/grounded.jpg',
  'Legacy': 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/legacy.jpg',
  'Plaza': 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/plaza.jpg',
  'Port': 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/port.jpg',
  'Village': 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/village.jpg',
  'Soar': 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/soar.jpg',
  'Castello': 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/castello.jpg',
  'Arctic': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Arctic+Map',
  'Cargo': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Cargo+Map'
};

const MINIMAP_IMAGES: Record<string, string> = {
  'Raid': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Raid+Minimap',
  'Bureau': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Bureau+Minimap',
  'Canals': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Canals+Minimap',
  'Coalition': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Coalition+Minimap',
  'Grounded': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Grounded+Minimap',
  'Legacy': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Legacy+Minimap',
  'Plaza': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Plaza+Minimap',
  'Port': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Port+Minimap',
  'Village': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Village+Minimap',
  'Soar': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Soar+Minimap',
  'Castello': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Castello+Minimap',
  'Arctic': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Arctic+Minimap',
  'Cargo': 'https://placehold.co/600x600/2b2d31/ffffff.png?text=Cargo+Minimap'
};

function getRankName(rank: number): string {
    const ranks = ["UNRANKED", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "SPEC OPS", "ELITE OPS"];
    return ranks[rank] || "UNKNOWN";
}

function getUserType(type: number): string {
    if (type === 2) return "Moderator";
    if (type === 3) return "Admin";
    if (type === 4) return "Developer";
    return "User";
}

function buildProfilePayload(copsData: any, type: string, discordId: string | null) {
    const basic = copsData.basicInfo;
    const clan = copsData.clan;
    const stats = copsData.stats;
    const pLevel = basic.playerLevel;
    
    const ignDisplay = clan?.basicInfo?.tag ? `[${clan.basicInfo.tag}] ${basic.name}` : basic.name;
    const discordDisplay = discordId && discordId !== 'null' ? `<@${discordId}>` : 'N/A';
    
    const embed = new EmbedBuilder()
      .setTitle(`${basic.name} Information`)
      .setColor('#2b2d31')
      .setFooter({ text: '[ry] #1' })
      .setTimestamp();
      
    if (type === 'basic') {
        let season = 'N/A';
        if (stats?.seasonal_stats && stats.seasonal_stats.length > 0) {
            season = stats.seasonal_stats[stats.seasonal_stats.length - 1].season.toString();
        }
        embed.setDescription(
`**Basic Info**
**ID:** ${basic.userID}
**IGN:** ${ignDisplay}
**Type:** ${getUserType(basic.userType)}

**Player Level**
**Level:** ${pLevel.level}
**XP:** ${pLevel.current_xp}/${pLevel.next_level_xp}

**Discord**
${discordDisplay}

**Ranked**
**Rank:** ${getRankName(stats?.ranked?.rank || 0)}
**Highest Rank:** ${getRankName(stats?.ranked?.highest_rank || 0)}
**Rating:** ${stats?.ranked?.mmr || 0} (#${stats?.leaderboard_data?.position || 0})
**Season:** ${season}

**Ban Status**
${copsData.ban ? 'Banned' : 'N/A'}`);
    } else if (type === 'clan') {
        if (clan) {
            let memberRankDisplay = clan.memberRank?.toString() || 'N/A';
            if (clan.memberRank === 10) memberRankDisplay = 'Member';
            if (clan.memberRank === 40) memberRankDisplay = 'Lead';
            
            embed.setDescription(
`**Clan Info**
**Name:** ${clan.basicInfo.name}
**Tag:** ${clan.basicInfo.tag}
**Clan ID:** ${clan.id}
**Member Rank:** ${memberRankDisplay}`
            );
        } else {
            embed.setDescription('This player is not in a clan.');
        }
    } else if (type === 'casual' || type === 'custom' || type === 'ranked') {
        let seasonStats: any = null;
        if (stats?.seasonal_stats && stats.seasonal_stats.length > 0) {
            seasonStats = stats.seasonal_stats[stats.seasonal_stats.length - 1][type];
        }
        if (seasonStats) {
            const k = seasonStats.k || 0;
            const d = seasonStats.d || 0;
            const a = seasonStats.a || 0;
            const w = seasonStats.w || 0;
            const l = seasonStats.l || 0;
            const kd = d > 0 ? (k/d).toFixed(2) : k.toFixed(2);
            const matches = w + l;
            const wl = matches > 0 ? ((w/matches)*100).toFixed(1) + '%' : '0%';
            
            embed.setDescription(
`**${type.charAt(0).toUpperCase() + type.slice(1)} Stats (Current Season)**
**Kills:** ${k}
**Deaths:** ${d}
**Assists:** ${a}
**K/D Ratio:** ${kd}

**Wins:** ${w}
**Losses:** ${l}
**W/L Ratio:** ${wl}`
            );
        } else {
            embed.setDescription(`No ${type} stats found for current season.`);
        }
    }

    const accountId = basic.userID;
    const dIdStr = discordId || 'null';
    
    const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`btn_basic_${accountId}_${dIdStr}`).setLabel('Basic Info').setStyle(type === 'basic' ? ButtonStyle.Primary : ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`btn_clan_${accountId}_${dIdStr}`).setLabel('Clan').setStyle(type === 'clan' ? ButtonStyle.Primary : ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`btn_casual_${accountId}_${dIdStr}`).setLabel('Casual').setStyle(type === 'casual' ? ButtonStyle.Primary : ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`btn_custom_${accountId}_${dIdStr}`).setLabel('Custom').setStyle(type === 'custom' ? ButtonStyle.Primary : ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId(`btn_ranked_${accountId}_${dIdStr}`).setLabel('Ranked').setStyle(type === 'ranked' ? ButtonStyle.Primary : ButtonStyle.Secondary)
    );
    
    return { embeds: [embed], components: [row1] };
}

const commands = [
  new SlashCommandBuilder()
    .setName('map')
    .setDescription('Show official map layouts')
    .addStringOption(option => 
      option.setName('name')
        .setDescription('Name of the map')
        .setRequired(true)
        .addChoices(
          { name: 'Raid', value: 'Raid' },
          { name: 'Bureau', value: 'Bureau' },
          { name: 'Canals', value: 'Canals' },
          { name: 'Coalition', value: 'Coalition' },
          { name: 'Grounded', value: 'Grounded' },
          { name: 'Legacy', value: 'Legacy' },
          { name: 'Plaza', value: 'Plaza' },
          { name: 'Port', value: 'Port' },
          { name: 'Village', value: 'Village' },
          { name: 'Soar', value: 'Soar' },
          { name: 'Castello', value: 'Castello' },
          { name: 'Arctic', value: 'Arctic' },
          { name: 'Cargo', value: 'Cargo' }
        )
    ),
  new SlashCommandBuilder()
    .setName('minimap')
    .setDescription('Show top-down map layouts (radar)')
    .addStringOption(option => 
      option.setName('name')
        .setDescription('Name of the map')
        .setRequired(true)
        .addChoices(
          { name: 'Raid', value: 'Raid' },
          { name: 'Bureau', value: 'Bureau' },
          { name: 'Canals', value: 'Canals' },
          { name: 'Coalition', value: 'Coalition' },
          { name: 'Grounded', value: 'Grounded' },
          { name: 'Legacy', value: 'Legacy' },
          { name: 'Plaza', value: 'Plaza' },
          { name: 'Port', value: 'Port' },
          { name: 'Village', value: 'Village' },
          { name: 'Soar', value: 'Soar' },
          { name: 'Castello', value: 'Castello' },
          { name: 'Arctic', value: 'Arctic' },
          { name: 'Cargo', value: 'Cargo' }
        )
    ),
  new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your Critical Ops account to Rusty FACEIT')
    .addStringOption(option => option.setName('ign').setDescription('Your Critical Ops IGN').setRequired(true)),
  new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View a player profile')
    .addStringOption(option => option.setName('username').setDescription('Player IGN'))
    .addUserOption(option => option.setName('member').setDescription('Discord Member')),
  new SlashCommandBuilder()
    .setName('servers')
    .setDescription('Check C-OPS server status'),
  new SlashCommandBuilder()
    .setName('top')
    .setDescription('View leaderboards')
    .addStringOption(option => 
      option.setName('category')
        .setDescription('Category to rank by')
        .setRequired(true)
        .addChoices(
          { name: 'Elo', value: 'elo' },
          { name: 'K/D Ratio', value: 'kd' },
          { name: 'Win Rate', value: 'winrate' },
          { name: 'Wins', value: 'wins' }
        )
    ),
  new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Join the 5v5 Matchmaking Queue'),
  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Leave the Matchmaking Queue')
].map(command => command.toJSON());

const queue = new Set<string>(); // Store Discord IDs

export async function startDiscordBot() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;

  if (!token) {
    console.warn('⚠️ DISCORD_TOKEN is missing in the environment. The Discord bot is currently offline.');
    return;
  }

  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  client.once('ready', async () => {
    console.log(`🤖 Discord Bot logged in as ${client.user?.tag}`);
    
    if (clientId) {
      try {
        const rest = new REST({ version: '10' }).setToken(token);
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(clientId), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error('Error registering slash commands:', error);
      }
    } else {
        console.warn('⚠️ DISCORD_CLIENT_ID is missing. Slash commands will not be registered.');
    }
  });

  client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith('btn_')) {
            const parts = interaction.customId.split('_');
            const type = parts[1];
            const accountId = parts[2];
            const discordId = parts[3] === 'null' ? null : parts[3];
            
            await interaction.deferUpdate();
            
            let copsData: any = null;
            try {
                copsData = await fetchPlayerData('id', accountId);
            } catch (e) {
                console.error(e);
                return;
            }
            if (!copsData || !copsData.basicInfo) return;
            
            const payload = buildProfilePayload(copsData, type, discordId);
            await interaction.editReply(payload);
        }
        return;
    }

    if (!interaction.isChatInputCommand()) return;

    // --- /SERVERS ---
    if (interaction.commandName === 'servers') {
      await interaction.deferReply();
      try {
        const response = await fetch(`${COPS_API_BASE}/status/servers`);
        const data = await response.json();
        
        const embed = new EmbedBuilder()
          .setTitle('Critical Ops Server Status')
          .setColor('#f59e0b')
          .setTimestamp();
          
        if (data && Array.isArray(data)) {
           // If the API returns an array directly
           let desc = '';
           data.forEach((server: any) => {
             desc += `**${server.name || server.region}**: ${server.status === 'online' ? '🟢 Online' : '🔴 Offline'}\n`;
           });
           embed.setDescription(desc || 'No server data available.');
        } else if (data && data.regions) {
           let desc = '';
           data.regions.forEach((server: any) => {
             desc += `**${server.name || server.region}**: ${server.status === 'online' ? '🟢 Online' : '🔴 Offline'}\n`;
           });
           embed.setDescription(desc || 'No server data available.');
        } else {
           embed.setDescription('🟢 All Systems Operational (Mock Fallback)');
        }
        
        await interaction.editReply({ embeds: [embed] });
      } catch (e) {
        const embed = new EmbedBuilder()
          .setTitle('Critical Ops Server Status')
          .setColor('#ef4444')
          .setDescription('Critical Ops API is currently unavailable. Please try again later.');
        await interaction.editReply({ embeds: [embed] });
      }
    }
    
    // --- /LINK ---
    if (interaction.commandName === 'link') {
       const ign = interaction.options.getString('ign')!;
       await interaction.deferReply({ ephemeral: true });
       
       try {
         const data = await fetchPlayerData('username', ign);
         if (!data || !data.basicInfo) throw new Error('API Error');
         
         let accountId = data.basicInfo.userID;
         
         const confirmButton = new ButtonBuilder()
            .setCustomId(`confirm_link_${accountId}_${ign}`)
            .setLabel(`Yes, I am ${ign}`)
            .setStyle(ButtonStyle.Success);
            
         const row = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton);
         
         const embed = new EmbedBuilder()
           .setTitle('Account Linking')
           .setColor('#f59e0b')
           .setDescription(`Found profile for **${ign}**.\n\nIs this your account?`)
           .addFields(
             { name: 'Account ID', value: String(accountId), inline: true }
           );
           
         const msg = await interaction.editReply({ embeds: [embed], components: [row] });
         
         const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
         
         collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
               await i.reply({ content: 'Not your interaction.', ephemeral: true });
               return;
            }
            
            linkedAccounts.set(interaction.user.id, {
              discordId: interaction.user.id,
              ign,
              accountId
            });
            
            playerStats.set(accountId, {
              elo: 1000,
              wins: 0,
              losses: 0,
              peakElo: 1000,
              matchesPlayed: 0
            });
            
            const successEmbed = new EmbedBuilder()
              .setTitle('✅ Account Linked')
              .setColor('#10b981')
              .setDescription(`Successfully linked **${ign}** to your Discord account.\nYou can now use matchmaking!`);
              
            await i.update({ embeds: [successEmbed], components: [] });
         });
         
       } catch (error) {
         await interaction.editReply('Critical Ops API is currently unavailable, or the profile could not be found.');
       }
    }

    // --- /PROFILE ---
    if (interaction.commandName === 'profile') {
       const ignParam = interaction.options.getString('username');
       const memberParam = interaction.options.getUser('member');
       
       await interaction.deferReply();
       
       let targetIgn = ignParam;
       let targetAccountId = null;
       let discordId = memberParam ? memberParam.id : (ignParam ? null : interaction.user.id);
       
       // If discord ID is provided, look up the linked account
       if (discordId) {
         const linked = linkedAccounts.get(discordId);
         if (linked) {
            targetIgn = linked.ign;
            targetAccountId = linked.accountId;
         } else if (!ignParam) {
            await interaction.editReply('You have not linked an account! Use `/link <ign>`.');
            return;
         }
       }
       
       if (!targetIgn && !targetAccountId) {
          await interaction.editReply('Could not determine which profile to look up.');
          return;
       }

       let copsData: any = null;
       try {
         if (targetAccountId) {
            copsData = await fetchPlayerData('id', targetAccountId.toString());
         } else {
            copsData = await fetchPlayerData('username', targetIgn as string);
         }
       } catch (error) {
         console.error('C-OPS API fetch failed', error);
         await interaction.editReply('Player not found or Critical Ops API is currently unavailable.');
         return;
       }

       if (!copsData || !copsData.basicInfo) {
         await interaction.editReply('Player not found.');
         return;
       }

       const payload = buildProfilePayload(copsData, 'basic', discordId);
       await interaction.editReply(payload);
    }
    
    // --- /TOP ---
    if (interaction.commandName === 'top') {
       const category = interaction.options.getString('category');
       const embed = new EmbedBuilder()
         .setTitle(`Leaderboard: Top ${category?.toUpperCase()}`)
         .setColor('#f59e0b')
         .setDescription(`1. RustyKing - 2450 Elo\n2. AimBotV2 - 2300 Elo\n3. SneakyBeaky - 2150 Elo`);
         
       await interaction.reply({ embeds: [embed] });
    }

    // --- /QUEUE ---
    if (interaction.commandName === 'queue') {
       const linked = linkedAccounts.get(interaction.user.id);
       if (!linked) {
          await interaction.reply({ content: 'You must `/link` your account first!', ephemeral: true });
          return;
       }
       
       if (queue.has(interaction.user.id)) {
          await interaction.reply({ content: 'You are already in the queue!', ephemeral: true });
          return;
       }
       
       queue.add(interaction.user.id);
       
       await interaction.reply(`✅ **${linked.ign}** joined the queue! [${queue.size}/10]`);
       
       if (queue.size === 10) {
          const players = Array.from(queue);
          queue.clear();
          
          const embed = new EmbedBuilder()
            .setTitle('🎮 Match Found!')
            .setColor('#10b981')
            .setDescription(`A 5v5 match has been generated! Check your DMs for the lobby details.`);
            
          await interaction.channel?.send({ content: players.map(id => `<@${id}>`).join(' '), embeds: [embed] });
       }
    }
    
    // --- /LEAVE ---
    if (interaction.commandName === 'leave') {
       if (!queue.has(interaction.user.id)) {
          await interaction.reply({ content: 'You are not in the queue.', ephemeral: true });
          return;
       }
       queue.delete(interaction.user.id);
       await interaction.reply(`❌ You left the queue. [${queue.size}/10]`);
    }

    // --- /MAP ---
    if (interaction.commandName === 'map') {
       const mapName = interaction.options.getString('name', true);
       const imageUrl = MAP_IMAGES[mapName] || `https://via.placeholder.com/600x600/2b2d31/ffffff.png?text=${encodeURIComponent(mapName)}+Map+Layout`;
       
       const embed = new EmbedBuilder()
         .setTitle(mapName)
         .setColor('#2b2d31')
         .setImage(imageUrl)
         .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() || undefined })
         .setTimestamp();
         
       await interaction.reply({ embeds: [embed] });
    }

    // --- /MINIMAP ---
    if (interaction.commandName === 'minimap') {
       const mapName = interaction.options.getString('name', true);
       const imageUrl = MINIMAP_IMAGES[mapName] || `https://via.placeholder.com/600x600/2b2d31/ffffff.png?text=${encodeURIComponent(mapName)}+Minimap`;
       
       const embed = new EmbedBuilder()
         .setTitle(mapName)
         .setColor('#2b2d31')
         .setImage(imageUrl)
         .setFooter({ text: `Requested by ${interaction.user.username} | ${new Date().toLocaleDateString('en-GB')}`, iconURL: interaction.user.displayAvatarURL() || undefined });
         
       await interaction.reply({ embeds: [embed] });
    }

  });

  try {
    await client.login(token);
  } catch (error) {
    console.error('Discord bot login failed:', error);
  }
}
