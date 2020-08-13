const fetch = require('node-fetch');
const { checkValidState } = require('../tools.js');
require('dotenv').config();

module.exports = {
	name: 'district-list',
	description: 'List of valid districts in India.',
	usage: '[statecode]',
	args: true,
	execute: async function (message, args) {
		const stateCode = args[0].toUpperCase();

		const stateData = await fetch('https://api.covid19india.org/state_district_wise.json')
			.then(response => response.json())
			.catch(error => console.error(error));

		const nationalData = await fetch('https://api.covid19india.org/data.json')
			.then(response => response.json())
			.catch(error => console.error(error));

		let index = checkValidState(stateCode, nationalData)

		if (index === -1) {
			message.channel.send(`Not a valid statecode, use ${process.env.PREFIX}state-list to see a list of statecodes`);
			return;
		}

		let state = nationalData['statewise'][index]['state'];
		let districts = `**Here's a list of districts in ${state}: **`;

		for (const i in stateData[state]['districtData']) {
			districts = districts.concat(`\n${i}`);
		}

		message.author.send(districts)
			.then(() => {
				if (message.channel.type === 'dm') return;
				message.reply(`A DM has been sent to you with a list of districts in ${state}.`);
			});
	},
};
