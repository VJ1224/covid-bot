const Discord = require('discord.js');
require('dotenv').config();
let data = require('../diagnosis.json');

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function startDiagnosis(message, answers) {
	const filter = (reaction) => {
		return ['👍', '👎'].includes(reaction.emoji.name);
	};

	data.reduce(async (promise,item)=> {
		const p = await promise;
		message.author.send(item.name)
		.then(message => {
			message.awaitReactions(filter, { max: 1, time: 300000, errors: ['time'] })
			.then(collected => {
				const reaction = collected.first();
				if (reaction.emoji.name === '👍') {
					answers.push(parseInt(item.score));
				} else {
					answers.push(0);
				}
			})
			.catch(error => {console.error(error); answers.push(-1);});
			})
	}, Promise.resolve());
}

module.exports = {
	name: 'diagnose',
	description: "COVID-19 diagnosis tool.",
	usage: ' ',
	async execute(message, args) {
		if (message.channel.type !== 'dm') message.reply('A DM has been sent to you for diagnosis.');
		let answers = [];
    message.author.send('**Beginning diagnosis tool for COVID-19**');
		await sleep(1000);
		message.author.send("Please select the statements that apply to you. React with 👍 or 👎.");
		await sleep(1000);
		const response = await startDiagnosis(message,answers);
		let i = 0
		while(answers.length != data.length) {
			await sleep(1000);
		}
		const score = answers.reduce((sum, a) => sum + a,0);
		const embed = new Discord.MessageEmbed()
		.setTitle('COVID-19 Diagnosis Results')

		if (score > 15)
			embed.setDescription('You likely have COVID-19. Call an emergency number or a medical professional to get further assistance.')
		else if (score > 10)
			embed.setDescription('You may have COVID-19. Get yourself tested and contact a medical professional for further assistance.')
		else if (score > 5)
			embed.setDescription('Few symptoms may be linked to COVID-19, continue to monitor them and take precautions. Consult a medical professional for further assistance.')
		else
			embed.setDescription('Low risk of COVID-19, continue to stay safe and take preventive measures.')
		if (score >= 0) message.author.send(embed);
		message.author.send('**Exiting diagnosis tool for COVID-19**');
	}
}
