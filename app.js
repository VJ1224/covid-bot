const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', async () => {
	console.log('Connected');
	console.log('Servers connected to:');
	const guildNames = client.guilds.cache.map(guild => guild.name + ': ' + guild.id).join('\n');
	console.log(guildNames);
	await client.user.setPresence({ activity: { name: `Plague Inc. | ${process.env.PREFIX} help` }, status: 'online' });
});

client.on('guildCreate', guild => {
	if (guild.available) {
		console.log(`Added to: ${guild.name}: ${guild.id}`);
	}
});

client.on('guildDelete', guild => {
	if (guild.available) {
		console.log(`Removed from: ${guild.name}: ${guild.id}`);
	}
});

client.on('message', async message => {
	if (message.author.bot) return;

	message.content = message.content.replace(/<@!?(\d+)>/g, '');
	message.content = message.content.trim();

	if (!message.content.startsWith(process.env.PREFIX)) return;

	const args = message.content.slice(process.env.PREFIX.length).split(' ');
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) {
		await message.reply(`Not a valid command, use ${process.env.PREFIX}help to see a list of valid commands.`);
		return;
	}

	if (command.args && !args.length) {
		let reply = 'No arguments provided.\n';

		if (command.usage) {
			reply += `Usage: ${process.env.PREFIX}${command.name} ${command.usage}`;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} second(s) before using the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


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
