const Discord = require('discord.js');

module.exports = {
	name: 'assist',
	aliases: ['emergency'],
	description: 'COVID-19 help and resources.',
	usage: ' ',
	execute: function (message, args) { // eslint-disable-line no-unused-vars
		const casesEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Help for India')
			.addFields(
				{
					name: 'National Helplines',
					value: '+91-11-23978046\n1075',
					inline: true
				},
				{
					name: 'State Helplines',
					value: '[States and UTs](https://www.mohfw.gov.in/pdf/coronvavirushelplinenumber.pdf)',
					inline: true
				},
				{
					name: 'Information',
					value: '[MyGov](https://www.mygov.in/covid-19)\n[MoHFW](https://www.mohfw.gov.in)\n[WHO](https://www.who.int/emergencies/diseases/novel-coronavirus-2019)',
					inline: true
				},
				{
					name: 'Aarogya Setu App',
					value: '[Android](https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu)/[iOS](https://apps.apple.com/in/app/aarogyasetu/id1505825357)',
					inline: true
				},
				{
					name: 'MyGov App',
					value: '[Android](https://play.google.com/store/apps/details?id=in.mygov.mobile&hl=en)/[iOS](https://apps.apple.com/in/app/mygov-india-%E0%A4%AE-%E0%A4%B0-%E0%A4%B8%E0%A4%B0%E0%A4%95-%E0%A4%B0/id1423088445)',
					inline: true
				},
				{
					name: 'FAQ',
					value: '[FAQ](https://www.mohfw.gov.in/pdf/FAQ.pdf)',
					inline: true
				}
			);

		message.channel.send(casesEmbed);
	},
};
