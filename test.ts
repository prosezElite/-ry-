import { fetchPlayerData } from 'criticalops-api';

async function test() {
  try {
    const data = await fetchPlayerData('username', 'gettingspecops');
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
