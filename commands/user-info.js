module.exports = {
	name: 'user-info',
	description: 'User Information',
	usage: '@user',
	execute: function (message) {
		if (message.mentions.users.size === 0) {
			message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
			return;
		}

		message.channel.send(`Username: ${message.mentions.users.first().username}
							 \nID: ${message.mentions.users.first().id}`);
	},
};
