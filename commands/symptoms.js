const fetch = require('node-fetch');
const Discord = require('discord.js');
require('dotenv').config();

module.exports = {
	name: 'symptoms',
	description: 'COVID-19 symptoms.',
	usage: ' ',
	execute: async function (message) {
		const url = 'https://api.infermedica.com/covid19/symptoms';
		const options = {
			headers: {
				'App-Id': process.env.INFERMEDICA_ID,
				'App-Key': process.env.INFERMEDICA_KEY,
				'Content-Type': 'application/json',
			},
		};

		const data = await fetch(url, options)
			.then(response => response.json())
			.catch(error => console.error(error));

		let symptoms = '';
		data.forEach(symptom => {
			symptoms = symptoms.concat(' - ', symptom.common_name, '\n');
		});

		const casesEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Symptoms')
			.setDescription(symptoms);

		message.channel.send(casesEmbed);
	},
};
