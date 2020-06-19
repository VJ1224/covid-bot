const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');
const fetch = require('node-fetch');

var stateList = ["MH: Maharashtra", "TN: Tamil Nadu", "DL: Delhi", "GJ: Gujarat",
"UP: Uttar Pradesh", "RJ: Rajasthan", "WB: West Bengal", "MP: Madhya Pradesh", "HR: Haryana",
"KA: Karnataka", "AP: Andhra Pradesh", "BR: Bihar", "TG: Telangana",
"JK: Jammu and Kashmir", "AS: Assam", "OR: Odisha", "PB: Punjab", "KL: Kerala", "UT: Uttarakhand",
"CT: Chhattisgarh", "JH: Jharkhand", "TR: Tripura", "LA: Ladakh", "GA: Goa", "HP: Himachal Pradesh",
"MN: Manipur", "CH: Chandigarh", "PY: Puducherry", "NL: Nagaland", "MZ: Mizoram",
"AR: Arunachal Pradesh", "SK: Sikkim", "DN: Daman and Diu", "AN: Andaman and Nicobar Islands",
"ML: Meghalaya", "LD: Lakshadweep"]

var validStates = ["MH", "TN", "DL", "GJ", "UP", "RJ", "WB", "MP", "HR", "KA", "AP", "BR", "TG",
"JK", "AS", "OR", "PB", "KL", "UT", "CT", "JH", "TR", "LA", "GA", "HP", "MN", "CH", "PY", "NL", "MZ",
"AR", "SK", "DN", "AN", "ML", "LD"]

client.once('ready', () => {
	console.log('Connected');
});

client.on('message', async message => {
	if (!message.content.startsWith(auth.prefix) || message.author.bot) return;

  const args = message.content.slice(auth.prefix.length).split(' ');
  const command = args.shift().toLowerCase();

	const nationalData = await fetch('https://api.covid19india.org/data.json').then(response => response.json());

  switch (command) {
		case 'ping': 	message.channel.send('Pong');
									break;

		case 'beep': message.channel.send('Bop');
								 break;

		case 'bop': message.channel.send('Beep');
								break;

		case 'bot': message.channel.send('This is a COVID-19 Information bot that gives information regarding the cases in India. \nCreated by Vansh Jain.')
							  break;

		case 'user-info': message.channel.send('Your username: ' + message.author.username +
											"\nYour ID: " + message.author.id);
											break;

		case 'cases': message.channel.send("India has " + nationalData['statewise'][0]['confirmed'] + " confirmed cases" +
										"\nIndia has " + nationalData['statewise'][0]['active'] + " active cases" +
										"\nIndia has " + nationalData['statewise'][0]['recovered'] + " recovered" +
										"\nIndia has " + nationalData['statewise'][0]['deaths'] + " deaths");
									break;

		case 'daily': var length = nationalData['cases_time_series'].length
									message.channel.send("India, " + nationalData['cases_time_series'][length-1]['date'] + ":" +
										"\n" + nationalData['cases_time_series'][length-1]['dailyconfirmed'] + " new cases" +
										"\n" + nationalData['cases_time_series'][length-1]['dailyrecovered'] + " recovered" +
										"\n" + nationalData['cases_time_series'][length-1]['dailydeceased'] + " deaths");
									break;

		case 'state': var state = args[0].toUpperCase();

									if (validStates.includes(state)) {
										for (var i = 0; i < nationalData['statewise'].length; i++) {
											if (nationalData['statewise'][i]['statecode'] === state) {
												message.channel.send(nationalData['statewise'][i]['state'] + " has " + nationalData['statewise'][i]['confirmed'] + " confirmed cases" +
													"\n" + nationalData['statewise'][i]['state'] + " has " + nationalData['statewise'][i]['active'] + " active cases" +
													"\n" + nationalData['statewise'][i]['state'] + " has " + nationalData['statewise'][i]['recovered'] + " recovered" +
													"\n" + nationalData['statewise'][i]['state'] + " has " + nationalData['statewise'][i]['deaths'] + " deaths")
												break;
											}
										}
									} else {
										message.channel.send("Not a valid statecode, use !state-list to see a list of statecodes")
									}

									break;

		case 'state-list': var string = "";
												for (var i = 0; i < stateList.length; i++) {
													string = string.concat(stateList[i] +"\n");
												}
												message.channel.send(string);
												break;

		case 'help':	message.channel.send("Commands: " +
										"\n\t!bot: Bot information" +
								 		"\n\t!cases: India's numbers" +
										"\n\t!daily: Yesterday's numbers" +
										"\n\t!state <statecode>: Statewise numbers" +
										"\n\t!state-list: List of states with statecode")
									break;

		default: message.channel.send("Not a valid command, use !help to see list of commands")
	}
});

client.login(auth.token);
