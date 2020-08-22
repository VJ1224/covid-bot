require('dotenv').config();
const Discord = require('discord.js');
const { errorMessage, fetchAsync } = require('../tools.js');
const plotly = require('plotly')("VJ1224", process.env.PLOTLY_KEY);

module.exports = {
    name: 'graph',
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
        let x = [], y = [];
        let limit = (args.length >= 1) ? parseInt(args[0]) : 10;

        for (let i = length - limit; i < length; i++) {
            x.push(nationalData['cases_time_series'][i]['date']);
            y.push(nationalData['cases_time_series'][i]['totalconfirmed']);
        }

        let data = [{
            x:x, y:y,
            mode: 'lines+markers',
            name: 'India\'s COVID-19 Cases',
            marker: {
                color: 'rgb(219, 64, 82)',
                size: 8
            },
            line: {
                color: 'rgb(219, 64, 82)',
                width: 1
            }
        }];

        let options = {
            title: "COVID-19 India Timeline",
            xaxis: {
                title: 'Date'
            },
            yaxis: {
                title: 'Cases'
            }
        };

        plotly.plot(data, options, async (error, response) => {
            if (error) return console.log(error);
            const graphEmbed = new Discord.MessageEmbed()
                .setTitle('COVID-19 Timeline: India')
                .setImage(response.url + '.png');

            await message.channel.send(graphEmbed);
        });
    },
};
