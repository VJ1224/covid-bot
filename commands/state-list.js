const { errorMessage, fetchAsync } = require("../tools");

module.exports = {
	name: 'state-list',
	description: 'List of valid states and statecodes in India.',
	usage: ' ',
	execute: async function (message) {
		let nationalData;
		try {
			nationalData = await fetchAsync('https://api.covid19india.org/data.json');
		} catch (e) {
			console.error(e);
			await errorMessage(message);
			return;
		}

		let states = '**Here\'s a list of statecodes: **\n';

		for (let i = 0; i < nationalData['statewise'].length; i++) {
			states = states.concat(`\n${nationalData['statewise'][i]['statecode']}: ${nationalData['statewise'][i]['state']}`);
		}

		message.author.send(states)
			.then(() => {
				if (message.channel.type === 'dm') return;
				message.reply('A DM has been sent to you with a list of states.');
			});
	},
};
