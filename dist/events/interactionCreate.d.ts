import type { Interaction, Collection } from 'discord.js';
import type { Command } from '../types/command.js';
export default function interactionCreate(commandsMap: Collection<string, Command>): (interaction: Interaction) => Promise<void>;
//# sourceMappingURL=interactionCreate.d.ts.map