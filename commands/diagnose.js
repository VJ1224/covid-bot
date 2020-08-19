const Discord = require('discord.js');
const axios = require('axios')
require('dotenv').config();


module.exports = {
	name: 'diagnose',
	description: 'COVID-19 diagnostic tool.',
	usage: ' ',
	execute: async function (message) {
		if (message.channel.type !== 'dm')
			message.reply('A DM has been sent to you for diagnosis.');

		const evidence = [];
		let person = {
			sex: undefined,
			age: undefined
		}

		message = await message.author.send('**Beginning diagnostic tool for COVID-19**');

		await askGender(message, person);

		if (!person.sex) {
			message.channel.send('**Exiting diagnostic tool for COVID-19**');
			return;
		}

		await askAge(message, person);

		if (!person.age) {
			message.channel.send('**Exiting diagnostic tool for COVID-19**');
			return;
		}

		await message.channel.send('React with 👍 or 👎 for each question');

		const yesOrNo = (reaction, user) => {
			return ['👍', '👎'].includes(reaction.emoji.name) && user.id !== message.author.id;
		};

		let diagnosis = await getDiagnosis(person, evidence, '/diagnosis');

		if (!diagnosis) {
			message.channel.send('**Exiting diagnostic tool for COVID-19**');
			return;
		}

		while (!diagnosis.should_stop) {
			message = await message.channel.send(diagnosis.question.text);
			let item_type = diagnosis.question.type;

			for (let item of diagnosis.question.items) {
				if (item_type !== 'single')
					message = await message.channel.send(item.name);

				try {
					const response = await message.awaitReactions(yesOrNo, { max: 1, time: 60000, errors: ['time'] });
					const reaction = response.first();
					if (reaction.emoji.name === '👍')
						evidence.push({
							'id': item.id,
							'choice_id': 'present'
						})
					else if (item_type !== 'group_single')
						evidence.push({
						'id': item.id,
						'choice_id': 'absent'
					})
				} catch (error) {
					message.channel.send('**Exiting diagnostic tool for COVID-19**');
					console.error(error);
					return;
				}
			}

			diagnosis = await getDiagnosis(person, evidence, '/diagnosis');

			if (!diagnosis) {
				message.channel.send('**Exiting diagnostic tool for COVID-19**');
				return;
			}
		}

		let result = await getDiagnosis(person, evidence,'/triage');

		if (!result) {
			message.channel.send('**Exiting diagnostic tool for COVID-19**');
			return;
		}

		const resultEmbed = new Discord.MessageEmbed()
			.setTitle(`Diagnosis Results: ${result.label}`)
			.setDescription(result.description);

		message.channel.send(resultEmbed);
	},
};

const axios_instance = axios.create({
	baseURL: 'https://api.infermedica.com/covid19',
	headers: {
		'App-Id': process.env.INFERMEDICA_ID,
		'App-Key': process.env.INFERMEDICA_KEY
	}
});

async function askGender(message, person) {
	const genderFilter = (reaction, user) => {
		return ['♂️', '♀️'].includes(reaction.emoji.name) && user.id !== message.author.id;
	};

	message = await message.channel.send('Choose your gender ♂ or ♀');
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

	message = await message.channel.send('How old are you?');

	try {
		const response = await message.channel.awaitMessages(ageFilter, { max: 1, time: 60000, errors: ['time']});
		person.age = parseInt(response.first().content);
	} catch (error) {
		person.age = null;
		console.error(error);
	}
}

async function getDiagnosis(person, evidence, endpoint) {
	try {
		let response = await axios_instance.post(endpoint, {
			'age': person.age,
			'sex': person.sex,
			'evidence': evidence
		});

		return response.data;
	} catch (e) {
		console.error(e);
		return null;
	}
}
