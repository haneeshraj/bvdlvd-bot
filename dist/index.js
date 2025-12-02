import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { env } from './config/env.js';
import commands from './commands/index.js';
import { registerEvents } from './events/index.js';
import { startKeepAlive } from './keep-alive.js';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ],
    partials: [Partials.Channel],
});
registerEvents(client, commands);
// client.once('clientReady', () => {
// 	client.user?.setActivity("");
// });
client.on('error', (err) => {
    console.error('Client error:', err);
});
// Start keep-alive server for 24/7 uptime
startKeepAlive();
client.login(env.token).catch((err) => {
    console.error('Login failed:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map