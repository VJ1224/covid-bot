const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

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

	if (message.mentions.has(client.user)) {
		client.commands.get('bot-info').execute(message, []);
	}

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

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		await message.reply('There was an error trying to execute that command.');
	}
});

client.login(process.env.TOKEN);
