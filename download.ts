import fs from 'fs';
import { fetch } from 'undici';

async function download(url, filename) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  console.log(res.status);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(filename, Buffer.from(buffer));
  console.log('Saved', filename, buffer.byteLength);
}

download('https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/maps/raid.jpg', 'maps_raid.jpg').then(() => {
  download('https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/map_pictures/raidmap.jpg', 'minimap_raid.jpg');
});

