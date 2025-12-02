import { SlashCommandBuilder } from 'discord.js';
export const command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    execute: async (interaction) => {
        await interaction.reply({
            content: '🏓 Pong!',
            flags: ['Ephemeral'],
        });
    },
};
export default command;
//# sourceMappingURL=ping.js.map