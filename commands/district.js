const fetch = require('node-fetch');
const Discord = require('discord.js');
const { toIndianFormat, checkValidDistrict, checkValidState } = require('../tools.js');
require('dotenv').config();

module.exports = {
	name: 'district',
	description: 'Districtwise COVID-19 cases in India.',
	usage: '[statecode] [districtname]',
	args: true,
	async execute(message, args) {
		const stateCode = args[0].toUpperCase();
		const stateData = await fetch('https://api.covid19india.org/state_district_wise.json')
			.then(response => response.json())
			.catch(error => console.error(error));
		const nationalData = await fetch('https://api.covid19india.org/data.json')
			.then(response => response.json())
			.catch(error => console.error(error));
		
		let index = checkValidState(stateCode, nationalData);

		if (index == -1) {
			message.channel.send('Not a valid statecode, use ' + process.env.PREFIX + 'state-list to see a list of statecodes');
			return;
		}

		let state = nationalData['statewise'][index]['state'];

		let district = '';
		args = args.splice(1);
		district = args.join(' ');

		let found = checkValidDistrict(district, state, stateData);

		if (!found) {
			message.channel.send('Not a valid district, use ' + process.env.PREFIX + 'district-list [statecode] to see a list of districts');
			return;
		}

		const casesEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Cases in ' + district + ', ' + state + ', India')
			.addFields(
				{ name: 'Confirmed', value: toIndianFormat(stateData[state]['districtData'][district]['confirmed']), inline: true },
				{ name: 'Active', value: toIndianFormat(stateData[state]['districtData'][district]['active']), inline: true },
				{ name: 'Recovered', value: toIndianFormat(stateData[state]['districtData'][district]['recovered']), inline: true },
				{ name: 'Deaths', value: toIndianFormat(stateData[state]['districtData'][district]['deceased']), inline: true },
			);

		message.channel.send(casesEmbed);
	},
};
