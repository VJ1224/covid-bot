const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Reads every file in the commands directory with a .js extension
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

// For each file in commands it adds the command to a collection
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// When the client is ready
client.on('ready', async () => {
	// Logs a list of servers the bot is on
	console.log('Connected');
	console.log('Servers connected to:');
	const guildNames = client.guilds.cache.map(guild => guild.name + ': ' + guild.id).join('\n');
	console.log(guildNames);
	await client.user.setPresence({ activity: { name: `Plague Inc. | ${process.env.PREFIX} help` }, status: 'online' });
});

client.on('guildCreate', guild => {
	// Log when added to a guild
	if (guild.available) {
		console.log(`Added to: ${guild.name}: ${guild.id}`);
	}
});

client.on('guildDelete', guild => {
	// Log when removed from a guild
	if (guild.available) {
		console.log(`Removed from: ${guild.name}: ${guild.id}`);
	}
});

client.on('message', async message => {
	// Ignore messages by a bot
	if (message.author.bot) return;

	// Removes all @ Discord mentions
	message.content = message.content.replace(/<@!?(\d+)>/g, '');
	message.content = message.content.trim();

	// If the message does not start with the prefix, ignore
	if (!message.content.startsWith(process.env.PREFIX)) return;

	// Get the command as well as the command arguments
	const args = message.content.slice(process.env.PREFIX.length).split(' ');
	const commandName = args.shift().toLowerCase();

	// Check if the command exists in the collection
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	// If it does not exist, send a message and leave
	if (!command) {
		await message.reply(`Not a valid command, use ${process.env.PREFIX}help to see a list of valid commands.`);
		return;
	}

	// If arguments are required but no arguments are provided, send a message and leave
	if (command.args && !args.length) {
		let reply = 'No arguments provided.\n';

		if (command.usage) {
			reply += `Usage: ${process.env.PREFIX}${command.name} ${command.usage}`;
		}

		return message.channel.send(reply);
	}

	// If the cooldown is not in the collection, add it
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	// Get current time and get list of time stamps in collection
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	// Get the duration of the command cooldown
	const cooldownAmount = (command.cooldown || 3) * 1000;

	// If the user exists in the timestamp collection, it means they have sent another request within the duration
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		// Send a message with the time left and leave
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} second(s) before using the \`${command.name}\` command.`);
		}
	}

	// Add the timestamp and set a timeout to delete it
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	// Try executing the command
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		await message.reply('There was an error trying to execute that command.');
	}
});

// noinspection JSIgnoredPromiseFromCall
client.login(process.env.TOKEN);
