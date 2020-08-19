require('dotenv').config();
const Discord = require('discord.js');

module.exports = {
	name: 'bot-info',
	description: 'Bot Information',
	usage: ' ',
	execute: function (message) {
		const infoEmbed = new Discord.MessageEmbed()
			.setTitle('COVID-19 India Bot')
			.setDescription(`A COVID-19 Information bot that gives updates regarding the cases in India. 
							 Also includes a diagnostic tool to check for COVID-19 as well as common symptoms and risk factors. 
							 Provides resources to seek further medical help.
							 Use ${process.env.PREFIX}help for a list of commands.`)
			.setFooter('Author: Vansh Jain')
			.setURL('https://github.com/VJ1224/covid-bot');

		message.channel.send(infoEmbed);
	},
};
