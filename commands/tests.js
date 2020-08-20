const Discord = require('discord.js');
const { toIndianFormat, errorMessage, fetchAsync } = require('../tools.js');

module.exports = {
	name: 'tests',
	description: 'India\'s COVID-19 test numbers.',
	usage: ' ',
	execute: async function (message) {
		let nationalData;
		try {
			nationalData = await fetchAsync('https://api.covid19india.org/data.json');
		} catch (e) {
			console.error(e);
			await errorMessage(message);
			return;
		}

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
