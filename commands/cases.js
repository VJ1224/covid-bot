const Discord = require('discord.js');
const { checkValidState, checkValidDistrict, toIndianFormat, errorMessage, fetchAsync } = require('../tools.js');

module.exports = {
	name: 'cases',
	aliases: ['total'],
	description: 'India\'s COVID-19 cases.',
	usage: '[statecode] [district]',
	execute: async function (message, args) {
		let stateCode;

		if (args.length >= 1) {
			stateCode = args[0].toUpperCase();

			if (args.length > 1) {
				args = args.splice(1);
				let district = args.join(' ').toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ');;
				await districtData(message, stateCode, district);
				return;
			}
		} else
			stateCode = 'TT';

		let index = await checkValidState(stateCode);

		if (index === -1) {
			message.channel.send(`Not a valid statecode, use ${process.env.PREFIX}state-list to see a list of statecodes`);
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

		const casesEmbed = new Discord.MessageEmbed()
			.setTitle(`COVID-19 Cases: ${nationalData['statewise'][index]['state']}, India`)
			.addFields(
				{
					name: 'Confirmed',
					value: toIndianFormat(nationalData['statewise'][index]['confirmed']),
					inline: true
				},
				{
					name: 'Active', value: toIndianFormat(nationalData['statewise'][index]['active']),
					inline: true
				},
				{
					name: 'Recovered',
					value: toIndianFormat(nationalData['statewise'][index]['recovered']),
					inline: true
				},
				{
					name: 'Deaths',
					value: toIndianFormat(nationalData['statewise'][index]['deaths']),
					inline: true
				},
				{
					name: 'Last Updated On:',
					value: nationalData['statewise'][index]['lastupdatedtime']
				}
			);

		await message.channel.send(casesEmbed);
	},
};

async function districtData(message, stateCode, district) {
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

	let index = await checkValidState(stateCode);

	if (index === -1) {
		message.channel.send(`Not a valid statecode, use ${process.env.PREFIX}state-list to see a list of statecodes`);
		return;
	}

	let state = nationalData['statewise'][index]['state'];

	let found = await checkValidDistrict(district, state);

	if (!found) {
		message.channel.send(`Not a valid district, use ${process.env.PREFIX}district-list [statecode] to see a list of districts`);
		return;
	}

	const casesEmbed = new Discord.MessageEmbed()
		.setTitle(`COVID-19 Cases in ${district}, ${state}, India`)
		.addFields(
			{
				name: 'Confirmed',
				value: toIndianFormat(stateData[state]['districtData'][district]['confirmed']),
				inline: true
			},
			{
				name: 'Active',
				value: toIndianFormat(stateData[state]['districtData'][district]['active']),
				inline: true
			},
			{
				name: 'Recovered',
				value: toIndianFormat(stateData[state]['districtData'][district]['recovered']),
				inline: true
			},
			{
				name: 'Deaths',
				value: toIndianFormat(stateData[state]['districtData'][district]['deceased']),
				inline: true
			}
		);

	await message.channel.send(casesEmbed);
}