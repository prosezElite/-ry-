import { fetch } from 'undici';
import fs from 'fs';
import path from 'path';

async function run() {
  const base = 'https://raw.githubusercontent.com/VarSwasTaken/Royal-Discord-Bot/main/src/images/';
  const files = ['maps/raid.jpg', 'map_pictures/raidmap.jpg', 'map_pictures/raid.jpg', 'map_pictures/raid2.jpg'];
  const outDir = 'src/assets/images';
  
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const f of files) {
    const r = await fetch(base + f);
    const buf = await r.arrayBuffer();
    fs.writeFileSync(path.join(outDir, f.replace(/\//g, '_')), Buffer.from(buf));
    console.log('saved', f);
  }
}

run();
