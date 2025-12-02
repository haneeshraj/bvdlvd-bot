import { SlashCommandBuilder, PermissionFlagsBits, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import type { Command } from '../types/command';

const FACTIONS = {
	CLARITY: '☀️ Order of Clarity',
	STATIC: '🌑 Child Of Static',
} as const;

export const command: Command = {
	data: new SlashCommandBuilder()
		.setName('assign')
		.setDescription('Assign a member to a faction')
		.addUserOption(option =>
			option
				.setName('member')
				.setDescription('The member to assign')
				.setRequired(true)
		)
		.addStringOption(option =>
			option
				.setName('faction')
				.setDescription('The faction to assign them to')
				.setRequired(true)
				.addChoices(
					{ name: '☀️ Order of Clarity', value: 'clarity' },
					{ name: '🌑 Child Of Static', value: 'static' }
				)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const targetUser = interaction.options.getUser('member', true);
		const guild = interaction.guild;

		if (!guild) {
			await interaction.editReply('This command can only be used in a server.');
			return;
		}

		const member = await guild.members.fetch(targetUser.id);
		if (!member) {
			await interaction.editReply('Could not find that member.');
			return;
		}

		const clarityRole = guild.roles.cache.find(r => r.name === FACTIONS.CLARITY);
		const staticRole = guild.roles.cache.find(r => r.name === FACTIONS.STATIC);

		if (!clarityRole || !staticRole) {
			await interaction.editReply('Could not find one or more faction roles. Please ensure all faction roles exist.');
			return;
		}

		const broadcastChannel = guild.channels.cache.find(
			ch => ch.name === 'thecalm' || ch.name === 'thefracture'
		) as TextChannel | undefined;

		if (!broadcastChannel) {
			await interaction.editReply('Could not find the broadcast channel (#thecalm or #thefracture).');
			return;
		}

		try {
			// Remove any existing faction roles
			await member.roles.remove([clarityRole, staticRole]);

			// Randomly assign to either faction (50/50 chance)
			const isClarity = Math.random() < 0.5;

			if (isClarity) {
				await member.roles.add(clarityRole);

				const embed = new EmbedBuilder()
					.setColor(0xFFD700)
					.setTitle('⚡ ASCENSION ⚡')
					.setDescription(`${member} has been elevated to the **${FACTIONS.CLARITY}**!`)
					.setFooter({ text: '- Courtesy of The Presence' })
					.setTimestamp();

				await broadcastChannel.send({ embeds: [embed] });

				const clarityChannel = guild.channels.cache.find(
					ch => ch.name.toLowerCase().includes('clarity') && ch.isTextBased()
				) as TextChannel | undefined;

				if (clarityChannel) {
					await clarityChannel.send(`Welcome ${member} to the **☀️ Order of Clarity**! ✨`);
				}

				await interaction.editReply(`✦ ${targetUser.tag} has been randomly assigned to **☀️ Order of Clarity**!`);
			}
			else {
				await member.roles.add(staticRole);

				const embed = new EmbedBuilder()
					.setColor(0x4B0082)
					.setTitle('🌑 DISSENTION 🌑')
					.setDescription(`${member} has descended into the **${FACTIONS.STATIC}**!`)
					.setFooter({ text: '- Courtesy of The Presence' })
					.setTimestamp();

				await broadcastChannel.send({ embeds: [embed] });

				const staticChannel = guild.channels.cache.find(
					ch => ch.name.toLowerCase().includes('static') && ch.isTextBased()
				) as TextChannel | undefined;

				if (staticChannel) {
					await staticChannel.send(`Welcome ${member} to the **🌑 Child Of Static**! 🔥`);
				}

				await interaction.editReply(`✦ ${targetUser.tag} has been randomly assigned to **🌑 Child Of Static**!`);
			}
		}
		catch (err) {
			console.error('Error assigning faction:', err);
			await interaction.editReply('There was an error assigning the faction. Please check bot permissions.');
		}
	},
};

export default command;