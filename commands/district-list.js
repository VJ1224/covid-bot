const { checkValidState, errorMessage, fetchAsync } = require('../tools.js');
require('dotenv').config();

module.exports = {
	name: 'district-list',
	description: 'List of valid districts in a state.',
	usage: '[statecode]',
	args: true,
	execute: async function (message, args) {
		const stateCode = args[0].toUpperCase();
		let index = await checkValidState(stateCode);

		if (index === -1) {
			message.channel.send(`Not a valid statecode, use ${process.env.PREFIX}state-list to see a list of statecodes`);
			return;
		}

		let stateData;
		try {
			stateData = await fetchAsync('https://api.covid19india.org/state_district_wise.json');
		} catch (e) {
			console.error(e);
			await errorMessage(message);
			return;
		}

		let nationalData;
		try {
			nationalData = await fetchAsync('https://api.covid19india.org/data.json');
		} catch (e) {
			console.error(e);
			await errorMessage(message);
			return;
		}

		let state = nationalData['statewise'][index]['state'];
		let districts = `**Here's a list of districts in ${state}: **`;

		for (const district in stateData[state]['districtData']) {
			districts = districts.concat(`\n${district}`);
		}

		await message.author.send(districts)

		if (message.channel.type === 'dm') return;
		message.reply(`A DM has been sent to you with a list of districts in ${state}.`);
	},
};
