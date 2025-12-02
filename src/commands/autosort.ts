import { SlashCommandBuilder, PermissionFlagsBits, TextChannel, EmbedBuilder } from 'discord.js';
import type { Command } from '../types/command';

const FACTIONS = {
	CLARITY: '☀️ Order of Clarity',
	STATIC: '🌑 Child Of Static',
} as const;

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('autosort')
		.setDescription('Automatically sort all unassigned members 50/50 into factions')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const guild = interaction.guild;
		if (!guild) {
			await interaction.editReply('This command can only be used in a server.');
			return;
		}

		const clarityRole = guild.roles.cache.find(r => r.name === FACTIONS.CLARITY);
		const staticRole = guild.roles.cache.find(r => r.name === FACTIONS.STATIC);

		if (!clarityRole || !staticRole) {
			await interaction.editReply('Could not find one or more faction roles.');
			return;
		}

		const broadcastChannel = guild.channels.cache.find(
			ch => ch.name === 'thecalm' || ch.name === 'thefracture'
		) as TextChannel | undefined;

		if (!broadcastChannel) {
			await interaction.editReply('Could not find the broadcast channel.');
			return;
		}

		try {
			await guild.members.fetch();

			// Get all members who don't have either faction role (they're in "immigration")
			const unassignedMembers = guild.members.cache.filter(member =>
				!member.user.bot &&
				!member.roles.cache.has(clarityRole.id) &&
				!member.roles.cache.has(staticRole.id)
			);

			if (unassignedMembers.size === 0) {
				await interaction.editReply('No unassigned members found to sort.');
				return;
			}

			const membersArray = Array.from(unassignedMembers.values());
			
			for (let i = membersArray.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[membersArray[i], membersArray[j]] = [membersArray[j], membersArray[i]];
			}

			const halfPoint = Math.floor(membersArray.length / 2);
			const clarityMembers = membersArray.slice(0, halfPoint);
			const staticMembers = membersArray.slice(halfPoint);

			await interaction.editReply(`Starting auto-sort for ${membersArray.length} members...\n${clarityMembers.length} → ☀️ Order of Clarity\n${staticMembers.length} → 🌑 Child Of Static`);

			const clarityChannel = guild.channels.cache.find(
				ch => ch.name.toLowerCase().includes('clarity') && ch.isTextBased()
			) as TextChannel | undefined;

			const staticChannel = guild.channels.cache.find(
				ch => ch.name.toLowerCase().includes('static') && ch.isTextBased()
			) as TextChannel | undefined;

			// Assign to Order of Clarity
			for (const member of clarityMembers) {
				await member.roles.add(clarityRole);
				const embed = new EmbedBuilder()
					.setColor(0xFFD700)
					.setTitle('⚡ ASCENSION ⚡')
					.setDescription(`${member} has been elevated to the **${FACTIONS.CLARITY}**!`)
					.setFooter({ text: '*✦ - Courtesy of The Presence*' })
					.setTimestamp();

				await broadcastChannel.send({ embeds: [embed] });

				if (clarityChannel) {
					await clarityChannel.send(`Welcome ${member} to the **Order of Clarity**! ✨`);
				}

				await new Promise(resolve => setTimeout(resolve, 1000));
			}

			// Assign to Children of Static
			for (const member of staticMembers) {
				await member.roles.add(staticRole);
				const embed = new EmbedBuilder()
					.setColor(0x4B0082)
					.setTitle('🌑 DISSENTION 🌑')
					.setDescription(`${member} has descended into the **${FACTIONS.STATIC}**!`)
					.setFooter({ text: '*✦ - Courtesy of The Presence*' })
					.setTimestamp();

				await broadcastChannel.send({ embeds: [embed] });

				if (staticChannel) {
					await staticChannel.send(`Welcome ${member} to the **Children of Static**! 🔥`);
				}

				await new Promise(resolve => setTimeout(resolve, 1000));
			}

			await interaction.followUp({
				content: `✅ Auto-sort complete! Assigned ${clarityMembers.length} to Clarity and ${staticMembers.length} to Static.`,
				ephemeral: true,
			});
		}
		catch (err) {
			console.error('Error during auto-sort:', err);
			await interaction.followUp({
				content: 'There was an error during the auto-sort process.',
				ephemeral: true,
			});
		}
	},
};

export default command;