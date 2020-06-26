const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
	name: 'cases',
	description: "India's COVID-19 numbers.",
	usage: ' ',
	async execute(message, args) {

    const nationalData = await fetch('https://api.covid19india.org/data.json')
			.then(response => response.json());
			.catch(error => console.log(error));

		const casesEmbed = new Discord.MessageEmbed()
		.setTitle('COVID-19 Cases in India')
		.addFields(
			{ name: 'Confirmed', value: nationalData['statewise'][0]['confirmed'], inline: true },
			{ name: 'Active', value: nationalData['statewise'][0]['active'], inline: true },
			{ name: 'Recovered', value: nationalData['statewise'][0]['recovered'], inline: true },
			{ name: 'Deaths', value: nationalData['statewise'][0]['deaths'], inline: true },
			{name: 'Last Updated On:', value:nationalData['statewise'][0]['lastupdatedtime']}
		)

		message.channel.send(casesEmbed)
	},
};
