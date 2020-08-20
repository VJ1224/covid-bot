const fetch = require('node-fetch');
const { toIndianFormat } = require('../tools.js');

module.exports = {
    name: 'states',
    description: 'India\'s COVID-19 cases sorted by state.',
    usage: ' ',
    execute: async function (message, args) {
        const nationalData = await fetch('https://api.covid19india.org/data.json')
            .then(response => response.json())
            .catch(error => console.error(error));

        let statesArray = [];
        for (let state in nationalData['statewise']) {
            statesArray.push(nationalData['statewise'][state]);
        }

        statesArray.sort(function(a,b){return b['confirmed'] - a['confirmed']});

        let statesMessage = '**COVID-19 Cases by State**\n```';
        statesMessage += addWhiteSpace('State', 20);
        statesMessage += '| ' + addWhiteSpace('Confirmed', 10);
        statesMessage += '| ' + addWhiteSpace('Active', 10);
        statesMessage += '| ' + addWhiteSpace('Recovered', 10);
        statesMessage += '| ' + addWhiteSpace('Deaths', 8);

        let count = -1, limit = (args.length >= 1) ? parseInt(args[0]) : 10;

        for (let state of statesArray) {
            count++;
            if (count === 0) continue;
            if (count > limit) break;

            statesMessage += `\n${addWhiteSpace(state['state'], 20)}`;
            statesMessage += `| ${addWhiteSpace(toIndianFormat(state['confirmed']), 10)}`;
            statesMessage += `| ${addWhiteSpace(toIndianFormat(state['active']), 10)}`;
            statesMessage += `| ${addWhiteSpace(toIndianFormat(state['recovered']), 10)}`;
            statesMessage += `| ${addWhiteSpace(toIndianFormat(state['deaths']), 8)}`;
        }

        statesMessage += '```';

        let splitOptions = {
            prepend : '```',
            append : '```'
        }
        await message.channel.send(statesMessage, {split: splitOptions});
    },
};

function addWhiteSpace(value, size) {
    return value.padEnd(size).substring(0, size);
}