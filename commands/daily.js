const { MessageEmbed } = require('discord.js');
const { checkValidState, toIndianFormat, errorMessage, fetchAsync } = require('../tools.js');

module.exports = {
	name: 'daily',
	description: 'India\'s COVID-19 cases yesterday.',
	usage: ' ',
	execute: async function (message, args) {
		let nationalData;
		try {
			nationalData = await fetchAsync('https://api.covid19india.org/data.json');
		} catch (e) {
			console.error(e);
			await errorMessage(message);
			return;
		}

		if (args.length >= 1) {
			let stateCode = args[0].toLowerCase();
			let index = await checkValidState(stateCode.toUpperCase());

			if (index === -1) {
				message.channel.send(`Not a valid statecode, use ${process.env.PREFIX}state-list to see a list of statecodes`);
				return;
			}

			let stateData = await fetchAsync('https://api.covid19india.org/states_daily.json');
			let length = stateData['states_daily'].length;

			const casesEmbed = new MessageEmbed()
				.setTitle(`COVID-19 Cases in ${nationalData['statewise'][index]['state']}, India on ${stateData['states_daily'][length - 1]['date']}`)
				.addFields(
					{
						name: 'Confirmed',
						value: toIndianFormat(stateData['states_daily'][length - 3][stateCode]),
						inline: true
					},
					{
						name: 'Recovered',
						value: toIndianFormat(stateData['states_daily'][length - 2][stateCode]),
						inline: true
					},
					{
						name: 'Deaths',
						value: toIndianFormat(stateData['states_daily'][length - 1][stateCode]),
						inline: true
					}
				);

			await message.channel.send(casesEmbed);

		} else
			await nationalDaily(nationalData, message);
	},
};

async function nationalDaily(nationalData, message) {
	const length = nationalData['cases_time_series'].length;

	const casesEmbed = new MessageEmbed()
		.setTitle(`COVID-19 Cases in India on ${nationalData['cases_time_series'][length - 1]['date']}`)
		.addFields(
			{
				name: 'Confirmed',
				value: toIndianFormat(nationalData['cases_time_series'][length - 1]['dailyconfirmed']),
				inline: true
			},
			{
				name: 'Recovered',
				value: toIndianFormat(nationalData['cases_time_series'][length - 1]['dailyrecovered']),
				inline: true
			},
			{
				name: 'Deaths',
				value: toIndianFormat(nationalData['cases_time_series'][length - 1]['dailydeceased']),
				inline: true
			}
		);

	await message.channel.send(casesEmbed);
}