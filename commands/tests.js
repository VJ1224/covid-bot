const fetch = require('node-fetch');
const Discord = require('discord.js');
const {errorMessage} = require("../tools");
const { toIndianFormat } = require('../tools.js');

module.exports = {
	name: 'tests',
	description: 'India\'s COVID-19 test numbers.',
	usage: ' ',
	execute: async function (message) {
		const nationalData = await fetch('https://api.covid19india.org/data.json')
			.then(response => response.json())
			.catch(error => {
				console.error(error);
				errorMessage(message);
			});

		const last = nationalData['tested'].length - 1;

		const casesEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Tests in India')
			.addFields(
				{
					name: 'Total',
					value: toIndianFormat(nationalData['tested'][last]['totalsamplestested']),
					inline: true
				},
				{
					name: 'Tests Per Million',
					value: toIndianFormat(nationalData['tested'][last]['testspermillion']),
					inline: true
				},
				{
					name: 'Tests Today',
					value: toIndianFormat(nationalData['tested'][last]['samplereportedtoday']),
					inline: true
				},
				{
					name: 'Last Updated On:',
					value: nationalData['tested'][last]['updatetimestamp']
				}
			);

		await message.channel.send(casesEmbed);
	},
};
