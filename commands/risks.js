const { MessageEmbed } = require('discord.js');
const { infermedica_axios, errorMessage } = require('../tools.js');
require('dotenv').config();

module.exports = {
	name: 'risks',
	description: 'COVID-19 Risk Factors.',
	usage: ' ',
	execute: async function (message) {
		let data;

		try {
			let response = await infermedica_axios.get('/risk_factors');
			data = response.data;
		} catch (e) {
			console.error(e);
			await errorMessage(message);
			return;
		}

		let risks = '';
		data.forEach(risk => {
			risks = risks.concat(' - ', risk.common_name, '\n');
		});

		const casesEmbed = new MessageEmbed()
			.setTitle('COVID-19 Risk Factors')
			.setDescription(risks);

		await message.channel.send(casesEmbed);
	},
};
