import { fetch } from 'undici';
async function test() {
  const url = 'https://static.wikia.nocookie.net/criticalops/images/c/cb/Raid_Map.png';
  try {
    const res = await fetch(url);
    console.log(url, res.status);
  } catch (e) {
    console.log(e);
  }
}
test();
