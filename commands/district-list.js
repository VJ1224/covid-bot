const fetch = require('node-fetch');
require('dotenv').config()

module.exports = {
	name: 'district-list',
	description: "List of valid districts and statecodes in India.",
	usage: '<statecode>',
  args: true,
	async execute(message, args) {
    const stateCode = args[0].toUpperCase();
    const stateData = await fetch('https://api.covid19india.org/state_district_wise.json').then(response => response.json());
    const nationalData = await fetch('https://api.covid19india.org/data.json').then(response => response.json());
    var state;

    var found = false;
    for (var i in nationalData['statewise']) {
      var temp = nationalData['statewise'][i]['statecode']
      if (temp === stateCode) {
        state = nationalData['statewise'][i]['state']
        found = true;
        break;
      }
    }

    if (!found) {
      message.channel.send("Not a valid statecode, use " + process.env.PREFIX + "state-list to see a list of statecodes")
      return;
    }

    var districts = "**Here's a list of districts in " + state + ": **\n";
    for (var i in stateData[state]["districtData"]) {
      districts = districts.concat("\n" + i)
    }

    message.author.send(districts)
		.then(() => {
			if (message.channel.type === 'dm') return;
			message.reply("A DM has been sent to you with a list of districts in " + state + ".");
		})
	},
};
