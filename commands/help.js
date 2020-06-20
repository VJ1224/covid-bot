const config = require('../config.json');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '<command name>',
	execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
      data.push("Here's a list of all my commands:");
      data.push(commands.map(command => command.name).join(', '));
      data.push("\nUse " + config.prefix + "help [command name] to get info on a specific command.");

      return message.author.send(data, { split: true })
      	.then(() => {
      		if (message.channel.type === 'dm') return;
      		message.reply("A DM has been sent to you with a list of commands.");
      	})
      	.catch(error => {
      		console.error("Could not send help DM to " + message.author.tag +"\n", error);
      		message.reply("Unable to send DM with list of commands.");
          messag.channel.send(data, {split: true})
      	});
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
    	return message.reply("Not a valid command.");
    }

    data.push("**Name:** "+ command.name);

    if (command.aliases) data.push("**Aliases:** " + command.aliases.join(', '));
    if (command.description) data.push("**Description:** " + command.description);
    if (command.usage) data.push("**Usage:** " + config.prefix + command.name + " " + command.usage);

    message.channel.send(data, { split: true });
	},
};
