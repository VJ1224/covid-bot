const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('/config.json');
const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Connected');
});

client.on('message', async message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).split(' ');
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) {
		message.reply('Not a valid command, use !help to see a list of valid commands.')
		return;
	}

	if (command.args && !args.length) {
		let reply = "You didn't provide any arguments, " + message.author.username + ".";

		if (command.usage) {
			reply += "\nThe proper usage would be: "+ config.prefix + command.name + " " + command.usage;
		}

		return message.channel.send(reply);
	}

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command.');
	}
});

client.login(config.token);
