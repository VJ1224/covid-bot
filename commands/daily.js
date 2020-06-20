const fetch = require('node-fetch');

module.exports = {
	name: 'daily',
	description: "India's COVID-19 numbers yesterday.",
	usage: ' ',
	async execute(message, args) {
    const nationalData = await fetch('https://api.covid19india.org/data.json').then(response => response.json());
    var length = nationalData['cases_time_series'].length
    message.channel.send("**India, " + nationalData['cases_time_series'][length - 1]['date'] + ":**" +
    "\n**Confirmed:** " + nationalData['cases_time_series'][length - 1]['dailyconfirmed'] +
    "\n**Recovered:** " + nationalData['cases_time_series'][length - 1]['dailyrecovered'] +
    "\n**Dead:** " + nationalData['cases_time_series'][length - 1]['dailydeceased']);
	},
};
