const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'memes',
	aliases: ['meme'],
	description: 'Sends a COVID-19 meme.',
	usage: ' ',
	execute: async function (message) {
		const subreddit = 'r/CoronavirusMemes';
		const memes = await fetch(`https://www.reddit.com/${subreddit}/hot/.json?limit=100`)
			.then(response => response.json())
			.catch(error => console.error(error));

		let posts = message.channel.nsfw ? memes.data.children.filter(post => post.data.post_hint === 'image') : memes.data.children.filter(post => !post.data.over_18 && post.data.post_hint === 'image');

		if (!posts.length) return message.reply('Sorry, we are currently out of memes! Try again later.');

		const random_number = Math.floor(Math.random() * posts.length);

		const memeEmbed = new Discord.MessageEmbed()
			.setTitle(posts[random_number].data.title)
			.setDescription(`Posted by: ${posts[random_number].data.author}`)
			.setImage(posts[random_number].data.url)
			.setFooter(`Memes from ${subreddit}`);

		await message.channel.send(memeEmbed);
	},
};
