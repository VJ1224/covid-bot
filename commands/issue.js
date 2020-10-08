const { MessageEmbed } = require('discord.js');
require('dotenv').config();

module.exports = {
    name: 'issue',
    description: 'Report issues to the bot owner',
    usage: ' ',
    execute: async function (message) {
        const messageEmbed = new MessageEmbed()
            .setTitle('Report Issue')
            .addField('GitHub Repo', '[COVID-19 India Bot Issues](https://github.com/VJ1224/covid-bot/issues)')
            .addField('Official Server', '[Join Vansh Jain\'s Server](https://discord.gg/4yBuYqK)');

        await message.channel.send(messageEmbed);
    },
};
