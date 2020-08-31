const { MessageEmbed } = require('discord.js');
const { errorMessage, fetchAsync } = require('../tools.js');

module.exports = {
	name: 'memes',
	aliases: ['meme'],
	description: 'Sends a COVID-19 meme.',
	usage: ' ',
	execute: async function (message) {
		const subreddit = 'r/CoronavirusMemes';

		let memes;
		try {
			memes = await fetchAsync(`https://www.reddit.com/${subreddit}/hot/.json?limit=100`);
		} catch (e) {
			console.error(e);
			await errorMessage(message);
			return;
		}

		let posts = message.channel.nsfw ? memes.data.children.filter(post => post.data.post_hint === 'image') : memes.data.children.filter(post => !post.data.over_18 && post.data.post_hint === 'image');

		if (!posts.length) return message.reply('Sorry, we are currently out of memes! Try again later.');

		const random_number = Math.floor(Math.random() * posts.length);

		const memeEmbed = new MessageEmbed()
			.setTitle(posts[random_number].data.title)
			.setDescription(`Posted by: ${posts[random_number].data.author}`)
			.setImage(posts[random_number].data.url)
			.setFooter(`Memes from ${subreddit}`);

		await message.channel.send(memeEmbed);
	},
};
