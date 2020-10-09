const { MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
	name: 'help',
	description: 'List all of commands and command specific info.',
	aliases: ['commands'],
	usage: '[command name]',
	execute: async function (message, args) {
		const data = [];
		const {commands} = message.client;
		const helpEmbed = new MessageEmbed();

		if (!args.length) {
			helpEmbed.setTitle('List of all my Commands');
			helpEmbed.setDescription(`Use ${process.env.PREFIX}help [command name] to get info on a specific command.`);
			commands.forEach(command => {
				helpEmbed.addField(command.name, command.description);
			});

			try {
				await message.author.send(helpEmbed);
				if (message.channel.type === 'dm') return;
				message.reply('A DM has been sent to you with a list of commands.');
			} catch(error) {
				message.reply('Unable to send DM with list of commands.');
				await message.channel.send(helpEmbed);
			}
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('Not a valid command.');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${process.env.PREFIX}${command.name} ${command.usage}`);

		await message.channel.send(data, {split: true});
	},
};
