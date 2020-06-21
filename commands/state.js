const fetch = require('node-fetch');
const Discord = require('discord.js');
require('dotenv').config()

module.exports = {
	name: 'state',
	description: "Statewise COVID-19 number's in India.",
  usage: '<statecode>',
  args: true,
	async execute(message, args) {
    const nationalData = await fetch('https://api.covid19india.org/data.json').then(response => response.json());
    var stateCodes = []
    var state = args[0].toUpperCase();
		var index = 0;
		var found = false;

    for (var i = 0; i < nationalData['statewise'].length; i++) {
      if (nationalData['statewise'][i]['statecode'] === state) {
				index = i;
				found = true;
				break;
      }
    }

		if (!found) {
      message.channel.send("Not a valid statecode, use " + process.env.PREFIX + "state-list to see a list of statecodes")
      return;
    }

		const casesEmbed = new Discord.MessageEmbed()
		.setColor('#f38181')
		.setTitle('COVID-19 Cases in ' + nationalData['statewise'][index]['state'] + ', India')
		.addFields(
			{ name: 'Confirmed', value: nationalData['statewise'][index]['confirmed'], inline: true },
			{ name: 'Active', value: nationalData['statewise'][index]['active'], inline: true },
			{ name: 'Recovered', value: nationalData['statewise'][index]['recovered'], inline: true },
			{ name: 'Deaths', value: nationalData['statewise'][index]['deaths'], inline: true },
		)
		.setTimestamp();

		message.channel.send(casesEmbed);
	},
};
