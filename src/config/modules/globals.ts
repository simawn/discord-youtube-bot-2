import { youtube } from '@googleapis/youtube';
import { YouTubeInterface } from 'bot-classes';
import config from 'bot-config';
import { Guild } from 'discord.js';
import redis from 'redis';

/**
 * GLOBALS
 * Set values that should NOT be user changeable yet used throughout many parts of the code as reference.
 */
const globals = {
	players: new Map<Guild['id'], YouTubeInterface>(),
	redisClient: redis.createClient({
		host: config.redisHost,
		port: config.redisPort
	}),
	youtubeApi: youtube({
		version: 'v3',
		auth: config.googleApiToken
	})
};

export default globals;
