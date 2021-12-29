import { SlashCommandBuilder } from '@discordjs/builders';
import { UserInteraction, YouTubeInterface, YouTubeVideo } from 'bot-classes';
import { ResponseEmojis } from 'bot-config';
import { safeJoinVoiceChannel } from 'bot-functions';
import { CommandInteraction } from 'discord.js';
import { BaseCommand } from '../BaseCommand';

export default class Play implements BaseCommand {
	constructor(public commandInteraction: CommandInteraction) {}

	register() {
		return new SlashCommandBuilder()
			.setName('play')
			.setDescription('If the bot is not busy, you can play something. Then it will continue the queue.')
			.addStringOption(option =>
				option.setName('query').setDescription('A search query. First result from the search query will be used.').setRequired(true)
			);
	}

	async runner() {
		const handler = await new UserInteraction(this.commandInteraction).init(false);

		try {
			handler.voiceChannel;

			const query = handler.commandInteraction.options.getString('query', true);
			const youtubeInterface = YouTubeInterface.getInterfaceForGuild(handler.guild);

			if (youtubeInterface.getBusyStatus()) {
				await handler.editWithEmoji('I am busy!', ResponseEmojis.Danger);
				return;
			}

			const [video] = await YouTubeVideo.search(query, 1);

			if (!video?.id?.videoId) {
				await handler.editWithEmoji('I could not find a video. Try something less specific?', ResponseEmojis.Danger);
				return;
			}

			const youtubeVideo = YouTubeVideo.fromId(video.id.videoId);
			await youtubeInterface.queue.queuePrepend(youtubeVideo);
			await handler.editWithEmoji('Preparing to play...', ResponseEmojis.Loading);
			youtubeInterface.setConnection(safeJoinVoiceChannel(handler.commandInteraction));
			const videoDetails = await youtubeInterface.getDetails(youtubeVideo.url);

			if (videoDetails) {
				await handler.commandInteraction.editReply(`🔊 Playing \`${videoDetails?.videoDetails.title}\`.`);
			} else {
				await handler.editWithEmoji(
					'Unable to play the video. It might be private, age restricted or something else. It will be skipped.',
					ResponseEmojis.Danger
				);
			}

			while (await youtubeInterface.queueRunner());
			youtubeInterface.deleteConnection();
		} catch (error: any) {
			handler.editWithEmoji(error.message, ResponseEmojis.Danger);
			console.error(error);
		}
	}
}