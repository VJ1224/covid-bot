const { toIndianFormat, addWhiteSpace, errorMessage, fetchAsync } = require('../tools.js');

module.exports = {
    name: 'states',
    description: 'India\'s COVID-19 cases sorted by state.',
    usage: ' ',
    execute: async function (message, args) {
        let nationalData;
        try {
            nationalData = await fetchAsync('https://api.covid19india.org/data.json');
        } catch (e) {
            console.error(e);
            await errorMessage(message);
            return;
        }

        let statesArray = [];
        for (let state of nationalData['statewise']) {
            statesArray.push(state);
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