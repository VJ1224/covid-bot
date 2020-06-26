require('dotenv').config()
const Discord = require('discord.js');

module.exports = {
	name: 'bot-info',
	description: 'Bot Information',
	usage: ' ',
	execute(message, args) {
		const infoEmbed = new Discord.MessageEmbed()
		.setTitle('COVID-19 India Bot')
		.setAuthor('Vansh Jain', '', 'https://github.com/VJ1224')
		.setDescription('This is a COVID-19 Information bot that gives information regarding the cases in India.\n\n' +
		'Use ' + process.env.PREFIX + 'help for a list of commands.'
		)
		.setTimestamp()

		message.channel.send(infoEmbed)
	},
};
