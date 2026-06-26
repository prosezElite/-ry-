import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { startDiscordBot } from './discord-bot.js';
import { fetchPlayerData } from 'criticalops-api';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'src/assets/images')));

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Mock Local Database for Rusty FACEIT
const playersDB = new Map([
  ['12345', { accountId: '12345', ign: 'RustyPlayer', discordId: '111222', elo: 1250, rank: 'Gold', wins: 45, losses: 30, peakElo: 1300 }]
]);

const COPS_API_BASE = 'https://api-cops.criticalforce.fi/public';

// --- API Routes ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rusty FACEIT API Online' });
});

// Proxy for Critical Ops API - Username Lookup
app.get('/api/cops/profile/username/:username', async (req, res) => {
  try {
    const data = await fetchPlayerData('username', req.params.username);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Critical Ops API is currently unavailable. Please try again later.' });
  }
});

// Proxy for Critical Ops API - ID Lookup
app.get('/api/cops/profile/id/:id', async (req, res) => {
  try {
    const data = await fetchPlayerData('id', req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Critical Ops API is currently unavailable. Please try again later.' });
  }
});

// Server Status
app.get('/api/cops/servers', async (req, res) => {
  try {
    const response = await fetch(`${COPS_API_BASE}/status/servers`);
    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Critical Ops API is currently unavailable. Please try again later.' });
  }
});

// Rusty Leaderboard (Local Mock)
app.get('/api/rusty/leaderboard', (req, res) => {
  const players = Array.from(playersDB.values()).sort((a, b) => b.elo - a.elo);
  res.json(players);
});

// AI Assistant Endpoint - HIGH Thinking Mode
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API Key missing' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `You are Rusty AI, an expert analyst for the [ry] Rusty Critical Ops community. 
      Analyze the player data or answer the user's question.
      
      Context Data: ${JSON.stringify(context)}
      
      User Question: ${message}`,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });
    
    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message || 'AI processing failed' });
  }
});


// --- Vite Middleware for Development ---
if (process.env.NODE_ENV !== 'production') {
  import('vite').then(async (vite) => {
    const viteServer = await vite.createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(viteServer.middlewares);
  });
} else {
  // Production static serving
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start Discord Bot in the background
  startDiscordBot().catch(console.error);
});
