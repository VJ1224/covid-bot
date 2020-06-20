const fetch = require('node-fetch');

module.exports = {
	name: 'state-list',
	description: "List of valid states and statecodes in India.",
	usage: ' ',
	async execute(message, args) {
    const nationalData = await fetch('https://api.covid19india.org/data.json').then(response => response.json());
    var states = ""
    for (var i = 0; i < nationalData['statewise'].length; i++) {
      states = states.concat("\n" + nationalData['statewise'][i]['statecode'] + ": " + nationalData['statewise'][i]['state'])
    }
    message.channel.send(states);
	},
};
