const fetch = require('node-fetch');
const Discord = require('discord.js');
require('dotenv').config();

module.exports = {
	name: 'risks',
	description: 'COVID-19 Risk Factors.',
	usage: ' ',
	execute: async function (message, args) { // eslint-disable-line no-unused-vars
		const url = 'https://api.infermedica.com/covid19/risk_factors';
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

		let risks = '';
		data.forEach(risk => {
			risks = risks.concat(' - ', risk.common_name, '\n');
		});

		const casesEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Risk Factors')
			.setDescription(risks);

		message.channel.send(casesEmbed);
	},
};
