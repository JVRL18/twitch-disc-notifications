import dotenv from 'dotenv'
import checkUptime from '../scripts/isOnline.mjs'
dotenv.config()

export const name = "ready"
export const once = true
export const execute = async (x, client) => {
  console.log(`\x1b[33m[!] ${x.user.tag} logged into discord!`);

  const commands = [...client.commands].map(x => x[1].data)
  await client.application.commands.set(commands)

  const activities = [
    { name: `Hello world`, type: 1 },
  ];

  let i = 0;

  checkUptime('fabinlolx', client)

  setInterval(() => {
    if (i >= activities.length) i = 0
    client.user.setActivity(activities[i])
    i++;
  }, 15 * 1000); // 15sec

}
