module.exports = {
	name: 'bot-info',
	description: 'Bot Information',
	usage: ' ',
	execute(message, args) {
		message.channel.send('This is a COVID-19 Information bot that gives information regarding the cases in India. \nCreated by Vansh Jain.');
	},
};
