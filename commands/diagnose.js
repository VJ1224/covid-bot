const Discord = require('discord.js');
const axios = require('axios')
require('dotenv').config();

const sleep = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
	name: 'diagnose',
	description: 'COVID-19 diagnostic tool.',
	usage: ' ',
	execute: async function (message, args) { // eslint-disable-line no-unused-vars
		if (message.channel.type !== 'dm')
			message.reply('A DM has been sent to you for diagnosis.');

		const evidence = [];
		let sex, age;

		const genderFilter = (reaction, user) => {
			return ['♂️', '♀️'].includes(reaction.emoji.name) && user.id === message.author.id;
		};

		const ageFilter = response => {
			return !Number.isNaN(response);
		};

		await message.author.send('**Beginning diagnostic tool for COVID-19**');

		await message.author.send('Choose your gender ♂ or ♀').then(async message => {
			message.react('♂️').then(() => message.react('♀️'));

			message.awaitReactions(genderFilter, { max: 1, time: 60000, errors: ['time'] })
				.then(collected => {
					const reaction = collected.first();
					if (reaction.emoji.name === '♂️') sex = 'male';
					else sex = 'female';
				})
				.catch(() => {
					message.channel.send('**Exiting diagnostic tool for COVID-19**');
				});
		});

		await message.author.send('How old are you?').then(async message => {
			message.channel.awaitMessages(ageFilter, { max: 1, time: 60000, errors: ['time']})
				.then(collected => {
					age = collected.first().content;
					message.channel.send(`You are a ${age} year old ${sex}`);
				})
				.catch(() => {
					message.channel.send('**Exiting diagnostic tool for COVID-19**');
				});
		});
	},
};
