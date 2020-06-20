module.exports = {
	name: 'beep',
	description: 'Beep',
	usage: ' ',
	execute(message, args) {
		message.channel.send('Bop.');
	},
};
