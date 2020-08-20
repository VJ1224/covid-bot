const fetch = require('node-fetch');
const Discord = require('discord.js');
const { toIndianFormat } = require('../tools.js');

module.exports = {
    name: 'states',
    description: 'India\'s COVID-19 cases sorted by state.',
    usage: ' ',
    execute: async function (message) {
        const nationalData = await fetch('https://api.covid19india.org/data.json')
            .then(response => response.json())
            .catch(error => console.error(error));

        let statesArray = [];
        for (let state in nationalData['statewise']) {
            statesArray.push(nationalData['statewise'][state]);
        }

        statesArray.sort(function(a,b){return b['confirmed'] - a['confirmed']});

        let description = '```';
        description += addWhiteSpace('State', 15);
        description += '| ' + addWhiteSpace('Confirmed', 10);
        description += '| ' + addWhiteSpace('Active', 10);
        description += '| ' + addWhiteSpace('Recovered', 10);
        description += '| ' + addWhiteSpace('Deaths', 8);

        let count = 0, limit = 10;

        for (let state in statesArray) {
            // noinspection JSIncompatibleTypesComparison
            if (state === 0) continue;
            if (count === limit) break;

            description += `\n${addWhiteSpace(statesArray[state]['state'], 15)}`;
            description += `| ${addWhiteSpace(toIndianFormat(statesArray[state]['confirmed']), 10)}`;
            description += `| ${addWhiteSpace(toIndianFormat(statesArray[state]['active']), 10)}`;
            description += `| ${addWhiteSpace(toIndianFormat(statesArray[state]['recovered']), 10)}`;
            description += `| ${addWhiteSpace(toIndianFormat(statesArray[state]['deaths']), 8)}`;

            count++;
        }

        description += '```';

        const casesEmbed = new Discord.MessageEmbed()
            .setTitle(`COVID-19 Cases by State`)
            .setDescription(description);

        await message.channel.send(casesEmbed);
    },
};

function addWhiteSpace(value, size) {
    return value.padEnd(size).substring(0, size);
}