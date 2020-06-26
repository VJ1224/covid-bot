const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
	console.log('Connected');
	console.log('Servers connected to:');
	const guildNames = client.guilds.cache.map(guild => guild.name).join("\n");
	console.log(guildNames);
	client.user.setPresence({ activity: { name: 'Plague Inc.'}, status: 'online' })
});

client.on('guildCreate', guild => {
	if (guild.available)
		console.log('Added to: ' + guild.name);
});

client.on('guildDelete', guild => {
	if (guild.available)
		console.log('Removed from: ' + guild.name);
});

client.on('message', message => {
	if (message.mentions.has(client.user)) {
		client.commands.get('bot-info').execute(message,[]);
	}

	if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

	const args = message.content.slice(process.env.PREFIX.length).split(' ');
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) {
		message.reply('Not a valid command, use ' + process.env.PREFIX + 'help to see a list of valid commands.')
		return;
	}

	if (command.args && !args.length) {
		let reply = "No arguments provided.";

		if (command.usage) {
			reply += "\nUsage: " + process.env.PREFIX + command.name + " " + command.usage;
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

client.login(process.env.TOKEN);
