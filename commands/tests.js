const fetch = require('node-fetch');
const Discord = require('discord.js');
const { toIndianFormat } = require('../tools.js');

module.exports = {
	name: 'tests',
	description: 'India\'s COVID-19 test numbers.',
	usage: ' ',
	async execute(message, args) { // eslint-disable-line no-unused-vars

		const nationalData = await fetch('https://api.covid19india.org/data.json')
			.then(response => response.json())
			.catch(error => console.error(error));
		const length = nationalData['tested'].length - 1;

		const casesEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Tests in India')
			.addFields(
				{ name: 'Total', value: toIndianFormat(nationalData['tested'][length]['totalsamplestested']), inline: true },
				{ name: 'Tests Per Million', value: toIndianFormat(nationalData['tested'][length]['testspermillion']), inline: true },
				{ name: 'Tests Today', value: toIndianFormat(nationalData['tested'][length]['samplereportedtoday']), inline: true },
				{ name: 'Last Updated On:', value: nationalData['tested'][length]['updatetimestamp'] }
			);

		message.channel.send(casesEmbed);
	},
};
