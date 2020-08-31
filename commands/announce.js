const { WebhookClient } = require('discord.js');

module.exports = {
    name: 'announce',
    description: 'Announce COVID-19 India Bot updates.',
    usage: ' ',
    execute: async function (message, args) {
        if (message.author.id !== '235414130197004288') return;
        const webhookClient = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);
        const text = args.join(' ')
        await webhookClient.send(text);
    },
};
