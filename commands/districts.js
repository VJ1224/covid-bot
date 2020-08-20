const { toIndianFormat, checkValidState, addWhiteSpace, errorMessage, fetchAsync } = require('../tools.js');

module.exports = {
    name: 'districts',
    description: 'COVID-19 cases in a state sorted by district.',
    args: true,
    usage: '[statecode]',
    execute: async function (message, args) {
        const stateCode = args[0].toUpperCase();
        let index = await checkValidState(stateCode);

        if (index === -1) {
            message.channel.send(`Not a valid statecode, use ${process.env.PREFIX}state-list to see a list of statecodes`);
            return;
        }

        let stateData;
        try {
            stateData = await fetchAsync('https://api.covid19india.org/state_district_wise.json');
        } catch (e) {
            console.error(e);
            await errorMessage(message);
            return;
        }

        let nationalData;
        try {
            nationalData = await fetchAsync('https://api.covid19india.org/data.json');
        } catch (e) {
            console.error(e);
            await errorMessage(message);
            return;
        }

        let state = nationalData['statewise'][index]['state'];
        let districtsData = [];
        let districtNames = Object.keys(stateData[state]['districtData']);

        for (let district in stateData[state]['districtData']) {
            districtsData.push(stateData[state]['districtData'][district]);
        }

        districtsData.map(function (obj, i) {
            return {
                data  : obj,
                name  : districtNames[i]
            };
        }).sort(function (a, b) {
            return b.data['confirmed'] - a.data['confirmed'];
        }).forEach(function (obj, i) {
            districtsData[i] = obj.data;
            districtNames[i] = obj.name;
        });

        let districtsMessage = `**COVID-19 Cases in ${state} by District**`;
        districtsMessage += '```\n';
        districtsMessage += addWhiteSpace('District', 15);
        districtsMessage += '| ' + addWhiteSpace('Confirmed', 10);
        districtsMessage += '| ' + addWhiteSpace('Active', 10);
        districtsMessage += '| ' + addWhiteSpace('Recovered', 10);
        districtsMessage += '| ' + addWhiteSpace('Deaths', 8);

        let count = -1, limit = (args.length >= 2) ? parseInt(args[1]) : 10;

        for (let district in districtsData) {
            count++;
            if (count === limit) break;

            districtsMessage += `\n${addWhiteSpace(districtNames[district], 15)}`;
            districtsMessage += `| ${addWhiteSpace(toIndianFormat(districtsData[district]['confirmed']), 10)}`;
            districtsMessage += `| ${addWhiteSpace(toIndianFormat(districtsData[district]['active']), 10)}`;
            districtsMessage += `| ${addWhiteSpace(toIndianFormat(districtsData[district]['recovered']), 10)}`;
            districtsMessage += `| ${addWhiteSpace(toIndianFormat(districtsData[district]['deceased']), 8)}`;
        }

        districtsMessage += '```';

        let splitOptions = {
            prepend : '```',
            append : '```'
        }
        await message.channel.send(districtsMessage, {split: splitOptions});
    },
};