const Discord = require('discord.js');
require('dotenv').config();
const { infermedica_axios } = require('../tools.js');

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
			return;
		}

		let symptoms = '';
		data.forEach(symptom => {
			symptoms = symptoms.concat(' - ', symptom.common_name, '\n');
		});

		const casesEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Symptoms')
			.setDescription(symptoms);

		await message.channel.send(casesEmbed);
	},
};
