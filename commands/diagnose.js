const fetch = require('node-fetch');
const Discord = require('discord.js');
require('dotenv').config();

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function startDiagnosis(message, data, answers) {
	const filter = (reaction) => {
		return ['👍', '👎'].includes(reaction.emoji.name);
	};
	message.channel.send('Please select the statements that apply to you.');
	message.channel.send('React with 👍 or 👎.');

	data.question.items.reduce(async (promise,item)=> {
	await promise;
	message.channel.send(item.name)
	.then(message => {
		message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
		.then(collected => {
			const reaction = collected.first();
			if (reaction.emoji.name === '👍') {
				answers.push('yes');
			} else if (reaction.emoji.name === '👎') {
				answers.push('no');
			}
		})
		.catch(error => console.error(error));
		})
	}, undefined)
}


module.exports = {
	name: 'diagnose',
	description: "COVID-19 symptoms.",
	usage: ' ',
	async execute(message, args) {
    var age, sex;
    var id = message.author.id;
    message.author.send('Beginning diagnosis tool for COVID19...')
      .then(async message => {
				message.channel.send('Choose sex.')
        	.then(async message => {
						message.react('♂️')
						.then(message.react('♀️'))
						const filter = (reaction) => {
							return ['♂️', '♀️'].includes(reaction.emoji.name);
						};

						message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
              .then (async collected => {
                const reaction = collected.first();
                if (reaction.emoji.name === '♂️')
                  sex = 'male';
                else if (reaction.emoji.name === '♀️')
                  sex = 'female';

								await sleep(1000);
                message.channel.send('How old are you?')
                  .then(async () => {
                    const filter = response => {
                      return true;
                    };

                    message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
                		.then(async collected => {
											if (!isNaN(collected.first().content)) {
												answers = []
                		    age = parseInt(collected.first().content);	const url = "https://api.infermedica.com/covid19/diagnosis";
													const options = {
														method: 'POST',
														headers: {
															'App-Id': process.env.INFERMEDICA_ID,
															'App-Key': process.env.INFERMEDICA_KEY,
															'Content-Type': 'application/json'
														},
														body: JSON.stringify({
															age: age,
															sex: sex,
															evidence: answers
														}),
													}
													const data = await fetch(url,options)
														.then(response => response.json())
														.catch(error => console.error(error));
													var cont = await startDiagnosis(message, data, answers);
													console.log(answers);
													console.log(cont);
											} else {
												message.channel.send('Not a number. Please restart.');
											}
                		})
									.catch(error => console.error(error));
                	})
								.catch(error => console.error(error));
              })
						.catch(error => console.error(error));
				})
			.catch(error => console.error(error));
			})
		.catch(error => console.error(error));
	}
}
