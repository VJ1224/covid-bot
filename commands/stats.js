const fetch = require('node-fetch');
const Discord = require('discord.js');
const { toIndianFormat, checkValidState, errorMessage, fetchAsync } = require('../tools.js');

module.exports = {
    name: 'stats',
    description: 'Statistics about the COVID-19 cases in India.',
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

        let stateData;
        try {
            stateData = await fetchAsync('https://api.covid19india.org/v4/data.json');
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

        const population = stateData[stateCode]['meta']['population'];
        const totalCases = stateData[stateCode]['total']['confirmed'];
        const recoveredCases = stateData[stateCode]['total']['recovered'];
        const deaths = stateData[stateCode]['total']['deceased'];

        const recoveryRate = ((recoveredCases / totalCases) * 100).toFixed(2);
        const deathRate = ((deaths / totalCases) * 100).toFixed(2);
        const infectedRate = ((totalCases / population) * 100).toFixed(2);

        const statsEmbed = new Discord.MessageEmbed()
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
                    name: 'Deaths',
                    value: toIndianFormat(deaths),
                    inline: true
                },
                {
                    name: 'Infected Rate',
                    value: `${infectedRate}%`,
                    inline: true
                },
                {
                    name: 'Recovery Rate',
                    value: `${recoveryRate}%`,
                    inline: true
                },
                {
                    name: 'Death Rate',
                    value: `${deathRate}%`,
                    inline: true
                }
            );

        await message.channel.send(statsEmbed);
    },
};
