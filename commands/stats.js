const fetch = require('node-fetch');
const Discord = require('discord.js');
const { toIndianFormat, checkValidState } = require('../tools.js');

module.exports = {
    name: 'stats',
    description: 'Statistics about the COVID-19 cases in India and state-wise',
    usage: '[statecode]',
    execute: async function (message, args) {
        let stateCode;

        if (args.length)
            stateCode = args[0].toUpperCase();
        else
            stateCode = 'TT';

        let index = await checkValidState(stateCode);

        if (index === -1) {
            message.channel.send(`Not a valid statecode, use ${process.env.PREFIX}state-list to see a list of statecodes`);
            return;
        }

        const stateData = await fetch('https://api.covid19india.org/v4/data.json')
            .then(response => response.json())
            .catch(error => console.error(error));

        const nationalData = await fetch('https://api.covid19india.org/data.json')
            .then(response => response.json())
            .catch(error => console.error(error));


        let state = nationalData['statewise'][index]['state'];
        const population = stateData[stateCode]['meta']['population'];
        const totalCases = stateData[stateCode]['total']['confirmed'];
        const recoveredCases = stateData[stateCode]['total']['recovered'];
        const recoveryRate = ((recoveredCases / totalCases) * 100).toFixed(2);

        const casesEmbed = new Discord.MessageEmbed()
            .setTitle(`COVID-19 Stats: ${state}, India`)
            .addFields(
                {
                    name: 'Population',
                    value: toIndianFormat(population),
                    inline: true
                },
                {
                    name: 'Total Cases',
                    value: toIndianFormat(totalCases),
                    inline: true
                },
                {
                    name: 'Recovered Cases',
                    value: toIndianFormat(recoveredCases),
                    inline: true
                },
                {
                    name: 'Recovery Rate',
                    value: `${recoveryRate}%`,
                    inline: true
                }
            );

        message.channel.send(casesEmbed);
    },
};
