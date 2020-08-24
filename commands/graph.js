require('dotenv').config();
const Discord = require('discord.js');
const { errorMessage, fetchAsync } = require('../tools.js');
const plotly = require('plotly')("VJ1224", process.env.PLOTLY_KEY);

module.exports = {
    name: 'graph',
    cooldown: 10,
    description: 'Graph of India\'s COVID-19 Cases',
    usage: '[days]',
    execute: async function (message, args) {
        let nationalData;
        try {
            nationalData = await fetchAsync('https://api.covid19india.org/data.json');
        } catch (e) {
            console.error(e);
            await errorMessage(message);
            return;
        }

        const length = nationalData['cases_time_series'].length;
        let x = [], confirmed = [], recovered = [], deceased = [];
        let limit = (args.length >= 1) ? parseInt(args[0]) : 10;
        limit = (limit > length) ? length : limit;

        for (let i = length - limit; i < length; i++) {
            x.push(nationalData['cases_time_series'][i]['date']);
            confirmed.push(nationalData['cases_time_series'][i]['totalconfirmed']);
            recovered.push(nationalData['cases_time_series'][i]['totalrecovered']);
            deceased.push(nationalData['cases_time_series'][i]['totaldeceased']);
        }

        const start_date = nationalData['cases_time_series'][length - limit]['date'];
        const end_date = nationalData['cases_time_series'][length - 1]['date'];

        let confirmedLine = {
            x:x, y:confirmed,
            mode: 'lines+markers',
            name: 'Confirmed',
            marker: {
                color: 'rgb(31,171,137)',
                size: 8
            },
            line: {
                color: 'rgb(31,171,137)',
                width: 1
            }
        }

        let recoveredLine = {
            x:x, y:recovered,
            mode: 'lines+markers',
            name: 'Recovered',
            marker: {
                color: 'rgb(61,132,168)',
                size: 8
            },
            line: {
                color: 'rgb(61,132,168)',
                width: 1
            }
        }

        let deceasedLine = {
            x:x, y:deceased,
            mode: 'lines+markers',
            name: 'Deaths',
            marker: {
                color: 'rgb(232,69,69)',
                size: 8
            },
            line: {
                color: 'rgb(232,69,69)',
                width: 1
            }
        }

        let data = [confirmedLine, recoveredLine, deceasedLine];

        let options = {
            title: `COVID-19 India Trend: ${start_date} - ${end_date}`
        };

        plotly.plot(data, options, async (error, response) => {
            if (error) return console.log(error);
            const graphEmbed = new Discord.MessageEmbed()
                .setTitle(`COVID-19 India Trend: ${start_date} - ${end_date}`)
                .setURL(response.url)
                .setImage(response.url + '.png');

            await message.channel.send(graphEmbed);
        });
    },
};
