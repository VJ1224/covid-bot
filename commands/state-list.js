const fetch = require('node-fetch');

module.exports = {
	name: 'state-list',
	description: "List of valid states and statecodes in India.",
	usage: ' ',
	async execute(message, args) {
    const nationalData = await fetch('https://api.covid19india.org/data.json')
			.then(response => response.json())
			.catch(error => console.log(error));
    var states = "**Here's a list of statecodes: **\n"

		for (var i = 0; i < nationalData['statewise'].length; i++) {
      states = states.concat("\n" + nationalData['statewise'][i]['statecode'] + ": " + nationalData['statewise'][i]['state'])
    }

    message.author.send(states)
		.then(() => {
			if (message.channel.type === 'dm') return;
			message.reply("A DM has been sent to you with a list of statecodes.");
		})
	},
};
