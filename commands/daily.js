const fetch = require('node-fetch');
const Discord = require('discord.js');
const { toIndianFormat } = require('../tools.js');

module.exports = {
	name: 'daily',
	description: 'India\'s COVID-19 numbers yesterday.',
	usage: ' ',
	async execute(message, args) { // eslint-disable-line no-unused-vars
		const nationalData = await fetch('https://api.covid19india.org/data.json')
			.then(response => response.json())
			.catch(error => console.error(error));

		const length = nationalData['cases_time_series'].length;

		const casesEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Cases in India on ' + nationalData['cases_time_series'][length - 1]['date'])
			.addFields(
				{ name: 'Confirmed', value: toIndianFormat(nationalData['cases_time_series'][length - 1]['dailyconfirmed']), inline: true },
				{ name: 'Recovered', value: toIndianFormat(nationalData['cases_time_series'][length - 1]['dailyrecovered']), inline: true },
				{ name: 'Deaths', value: toIndianFormat(nationalData['cases_time_series'][length - 1]['dailydeceased']), inline: true },
			);

		message.channel.send(casesEmbed);
	},
};
