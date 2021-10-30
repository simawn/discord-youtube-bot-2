import { YouTubeInterface } from 'bot-classes';
import { GuildMember } from 'discord.js';
import { CommandHandler } from '../CommandHandler.types';

const skip: CommandHandler = async interaction => {
	try {
		const guildMember = interaction.member;
		await interaction.deferReply();

		if (!interaction?.guild?.id || !(guildMember instanceof GuildMember)) {
			return;
		}

		// Prevents cheeky people from skipping when they're not connected with the people listening!
		const voiceChannel = guildMember.voice.channel;

		if (!voiceChannel) {
			await interaction.editReply('🚨 You must be connected to a voice channel for me to skip the audio!');
			return;
		}

		const audioInterface = YouTubeInterface.getInterfaceForGuild(interaction.guild);
		const skipped = audioInterface.emitAudioFinish();

		if (skipped) {
			await interaction.editReply('➡️ The audio has been skipped.');
		} else {
			await interaction.editReply('🚨 I cannot skip as I am not playing anything!');
		}
	} catch (error) {
		console.error(error);
	}
};

export default skip;
