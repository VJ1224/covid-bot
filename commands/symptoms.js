const { MessageEmbed }= require('discord.js');
const { infermedica_axios, errorMessage } = require('../tools.js');
require('dotenv').config();

module.exports = {
	name: 'symptoms',
	description: 'COVID-19 symptoms.',
	usage: ' ',
	execute: async function (message) {
		let data;

		try {
			let response = await infermedica_axios.get('/symptoms');
			data = response.data;
		} catch (e) {
			console.error(e);
			await errorMessage(message);
		}

		let symptoms = '';
		data.forEach(symptom => {
			symptoms = symptoms.concat(' - ', symptom.common_name, '\n');
		});

		const casesEmbed = new MessageEmbed()
			.setTitle('COVID-19 Symptoms')
			.setDescription(symptoms);

		await message.channel.send(casesEmbed);
	},
};
