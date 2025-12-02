export default function interactionCreate(commandsMap) {
    return async (interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        const cmd = commandsMap.get(interaction.commandName);
        if (!cmd)
            return;
        try {
            await cmd.execute(interaction);
        }
        catch (err) {
            console.error('Command error:', err);
            if (interaction.deferred || interaction.replied) {
                await interaction.followUp({ content: 'There was an error executing this command.', ephemeral: true });
            }
            else {
                await interaction.reply({ content: 'There was an error executing this command.', ephemeral: true });
            }
        }
    };
}
//# sourceMappingURL=interactionCreate.js.map