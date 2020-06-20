module.exports = {
	name: 'ping',
	description: 'Ping',
	usage: ' ',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};
