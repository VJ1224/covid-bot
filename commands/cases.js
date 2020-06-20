const fetch = require('node-fetch');

module.exports = {
	name: 'cases',
	description: "India's COVID-19 numbers.",
	usage: ' ',
	async execute(message, args) {
    const nationalData = await fetch('https://api.covid19india.org/data.json').then(response => response.json());
		message.channel.send("**India**" + "\n**Confirmed:** " + nationalData['statewise'][0]['confirmed'] +
    "\n**Active:** " + nationalData['statewise'][0]['active'] +
    "\n**Recovered:** " + nationalData['statewise'][0]['recovered'] +
    "\n**Dead:** " + nationalData['statewise'][0]['deaths']);
	},
};
