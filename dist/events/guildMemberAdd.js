export default function guildMemberAdd(client) {
    client.on('guildMemberAdd', async (member) => {
        if (member.user.bot)
            return;
        // New members automatically have no faction roles
        // They remain in "The Presence Immigration System" conceptually
        // until an admin assigns them using /assign command
        console.log(`New member ${member.user.tag} joined - awaiting faction assignment`);
    });
}
//# sourceMappingURL=guildMemberAdd.js.map