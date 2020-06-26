require('dotenv').config()
const Discord = require('discord.js');

module.exports = {
	name: 'bot-info',
	description: 'Bot Information',
	usage: ' ',
	execute(message, args) {
		const infoEmbed = new Discord.MessageEmbed()
		.setTitle('COVID-19 India Bot')
		.setDescription('This is a COVID-19 Information bot that gives information regarding the cases in India.\n\n' +
		'Use ' + process.env.PREFIX + 'help for a list of commands.'
		)
		.setFooter('Author: Vansh Jain')
		.setURL('https://github.com/VJ1224')

		message.channel.send(infoEmbed)
	},
};
