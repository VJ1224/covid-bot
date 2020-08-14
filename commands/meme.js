const Discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'memes',
	aliases: ['meme'],
	description: 'Sends a COVID-19 meme.',
	usage: ' ',
	execute: async function (message, args) { // eslint-disable-line no-unused-vars
		const subreddit = 'r/CoronavirusMemes';
		const memes = await fetch(`https://www.reddit.com/${subreddit}/hot/.json?limit=100`)
			.then(response => response.json())
			.catch(error => console.error(error));

		// noinspection JSUnusedAssignment
		let posts = message.channel.nsfw ? memes.data.children : memes.data.children.filter(post => !post.data.over_18);
		posts = memes.data.children.filter(post => post.data.post_hint === 'image');

		if (!posts.length) return message.reply('Sorry, we are currently out of memes! Try again later.');

		const random_number = Math.floor(Math.random() * posts.length);

		const memeEmbed = new Discord.MessageEmbed()
			.setTitle(posts[random_number].data.title)
			.setDescription(`Posted by: ${posts[random_number].data.author}`)
			.setImage(posts[random_number].data.url)
			.setFooter(`Memes from ${subreddit}`);

		message.channel.send(memeEmbed);
	},
};