const Discord = require('discord.js');
const axios = require('axios')
require('dotenv').config();

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function askGender(message, person) {
	const genderFilter = (reaction, user) => {
		return ['♂️', '♀️'].includes(reaction.emoji.name) && user.id === message.author.id;
	};

	message = await message.author.send('Choose your gender ♂ or ♀');
	message.react('♂️').then(() => message.react('♀️'));

	try {
		const response = await message.awaitReactions(genderFilter, { max: 1, time: 60000, errors: ['time'] });
		const reaction = response.first();
		if (reaction.emoji.name === '♂️') person.sex = 'male';
		else person.sex = 'female';
	} catch (error) {
		person.sex = null;
		console.error(error);
	}
}

async function askAge(message, person) {
	const ageFilter = response => {
		return !Number.isNaN(response);
	};

	message = await message.author.send('How old are you?');

	try {
		const response = await message.channel.awaitMessages(ageFilter, { max: 1, time: 60000, errors: ['time']});
		person.age = parseInt(response.first().content);
	} catch (error) {
		person.age = null;
		console.error(error);
	}
}

async function getQuestions(person, evidence) {
	const instance = axios.create({
		baseURL: 'https://api.infermedica.com/covid19',
		headers: {
			'App-Id': process.env.INFERMEDICA_ID,
			'App-Key': process.env.INFERMEDICA_KEY
		}
	});

	let response = await instance.post('/diagnosis', {
		'age': person.age,
		'sex': person.sex,
		'evidence': evidence
	});

	return response.data;
}

module.exports = {
	name: 'diagnose',
	description: 'COVID-19 diagnostic tool.',
	usage: ' ',
	execute: async function (message, args) { // eslint-disable-line no-unused-vars
		if (message.channel.type !== 'dm')
			message.reply('A DM has been sent to you for diagnosis.');

		const evidence = [];
		let person = {
			sex: undefined,
			age: undefined
		}

		message.author.send('**Beginning diagnostic tool for COVID-19**');

		await askGender(message, person);
		await askAge(message, person);

		while (person.sex === undefined || person.age === undefined) {
			await sleep(500);
		}

		if (person.sex === null && person.age === null) {
			message.author.send('**Exiting diagnostic tool for COVID-19**');
			return;
		}

		message.author.send(`You are a ${person.age} year old ${person.sex}.`);

		let result = await getQuestions(person, evidence);
	},
};
