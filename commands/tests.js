const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
	name: 'tests',
	description: "India's COVID-19 test numbers.",
	usage: ' ',
	async execute(message, args) {

    const nationalData = await fetch('https://api.covid19india.org/data.json')
			.then(response => response.json());
			.catch(error => console.log(error));
    var length = nationalData['tested'].length - 1;

		const casesEmbed = new Discord.MessageEmbed()
		.setTitle('COVID-19 Tests in India')
		.addFields(
			{ name: 'Total', value: nationalData['tested'][length]['totalsamplestested'], inline: true },
			{ name: 'Tests Per Million', value: nationalData['tested'][length]['testspermillion'], inline: true },
			{ name: 'Tests Today', value: nationalData['tested'][length]['samplereportedtoday'], inline: true },
			{name: 'Last Updated On:', value:nationalData['tested'][length]['updatetimestamp']}
		)

		message.channel.send(casesEmbed)
	},
};
