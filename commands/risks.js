const Discord = require('discord.js');
require('dotenv').config();
const { infermedica_axios } = require('../tools.js');

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
			return;
		}

		let risks = '';
		data.forEach(risk => {
			risks = risks.concat(' - ', risk.common_name, '\n');
		});

		const casesEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Risk Factors')
			.setDescription(risks);

		await message.channel.send(casesEmbed);
	},
};
