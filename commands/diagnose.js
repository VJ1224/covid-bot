const Discord = require('discord.js');

module.exports = {
	name: 'diagnose',
	description: 'COVID-19 diagnostic tool.',
	usage: ' ',
	execute: async function (message, args) { // eslint-disable-line no-unused-vars
		const embed = new Discord.MessageEmbed()
			.setTitle('COVID-19 Diagnosis')
			.setDescription('Please visit the follow link for the diagnosis tool')
			.addField('Symptom Checker ','[Symptomate](https://symptomate.com/covid19/checkup/)', false)

		message.channel.send(embed);
	},
};
