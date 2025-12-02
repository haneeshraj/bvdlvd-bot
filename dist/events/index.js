import { Collection, Events } from 'discord.js';
import ready from './ready.js';
import interactionCreate from './interactionCreate.js';
import guildMemberAdd from './guildMemberAdd.js';
export function registerEvents(client, commands) {
    const map = new Collection();
    for (const c of commands)
        map.set(c.data.name, c);
    client.once(Events.ClientReady, () => ready(client));
    client.on(Events.InteractionCreate, interactionCreate(map));
    guildMemberAdd(client);
}
//# sourceMappingURL=index.js.map