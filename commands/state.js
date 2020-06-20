const fetch = require('node-fetch');

module.exports = {
	name: 'state',
	description: "Statewise COVID-19 number's in India.",
  usage: '<statecode>',
  args: true,
	async execute(message, args) {
    const nationalData = await fetch('https://api.covid19india.org/data.json').then(response => response.json());
    var stateCodes = []
    var state = args[0].toUpperCase();

    for (var i = 0; i < nationalData['statewise'].length; i++) {
      stateCodes[i] = nationalData['statewise'][i]['statecode']
    }

    if (stateCodes.includes(state)) {
      for (var i = 0; i < nationalData['statewise'].length; i++) {
        if (nationalData['statewise'][i]['statecode'] === state) {
          message.channel.send("**" + nationalData['statewise'][i]['state'] + ", India:**" +
          "\n**Confirmed:** " + nationalData['statewise'][i]['confirmed'] +
          "\n**Active:** " + nationalData['statewise'][i]['active'] +
          "\n**Recovered:** " + nationalData['statewise'][i]['recovered'] +
          "\n**Dead:** " + nationalData['statewise'][i]['deaths'])
          break;
        }
      }
    } else {
      message.channel.send("Not a valid statecode, use !state-list to see a list of statecodes")
    }
	},
};
