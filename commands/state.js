const fetch = require('node-fetch');
const Discord = require('discord.js');

module.exports = {
	name: 'state',
	description: "Statewise COVID-19 number's in India.",
  usage: '<statecode>',
  args: true,
	async execute(message, args) {
    const nationalData = await fetch('https://api.covid19india.org/data.json').then(response => response.json());
    var stateCodes = []
    var state = args[0].toUpperCase();

    for (var i = 0; i < nationalData['statewise'].length; i++) {
      stateCodes[i] = nationalData['statewise'][i]['statecode']
    }

    if (stateCodes.includes(state)) {
      for (var i = 0; i < nationalData['statewise'].length; i++) {
        if (nationalData['statewise'][i]['statecode'] === state) {
					const casesEmbed = new Discord.MessageEmbed()
					.setColor('#f38181')
					.setTitle('COVID-19 Cases in ' + nationalData['statewise'][i]['state'] + ', India')
					.addFields(
						{ name: 'Confirmed', value: nationalData['statewise'][i]['confirmed'], inline: true },
						{ name: 'Active', value: nationalData['statewise'][i]['active'], inline: true },
						{ name: 'Recovered', value: nationalData['statewise'][i]['recovered'], inline: true },
						{ name: 'Deaths', value: nationalData['statewise'][i]['deaths'], inline: true },
					)
					.setTimestamp();

					message.channel.send(casesEmbed)
          break;
        }
      }
    } else {
      message.channel.send("Not a valid statecode, use !state-list to see a list of statecodes")
    }
	},
};
