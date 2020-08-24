require('dotenv').config();
const Discord = require('discord.js');
const { errorMessage, fetchAsync } = require('../tools.js');
const axios = require('axios');

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
        let dates = [], confirmed = [], recovered = [], deceased = [], active = [];
        let limit = (args.length >= 1) ? parseInt(args[0]) : 10;
        limit = (limit > length) ? length : limit;

        for (let i = length - limit; i < length; i++) {
            let c = nationalData['cases_time_series'][i]['totalconfirmed'];
            let r = nationalData['cases_time_series'][i]['totalrecovered'];
            let d = nationalData['cases_time_series'][i]['totaldeceased'];
            dates.push(nationalData['cases_time_series'][i]['date']);
            confirmed.push(c);
            recovered.push(r);
            deceased.push(d);
            active.push(c - r - d);
        }

        const start_date = nationalData['cases_time_series'][length - limit]['date'];
        const end_date = nationalData['cases_time_series'][length - 1]['date'];

        let confirmedLine = {
            data: confirmed,
            label: 'Confirmed',
            fill: false,
            backgroundColor: 'rgb(31,171,137)',
            borderColor: 'rgb(31,171,137)',
            pointRadius: 0
        }

        let recoveredLine = {
            data: recovered,
            label: 'Recovered',
            fill: false,
            backgroundColor: 'rgb(61,132,168)',
            borderColor: 'rgb(61,132,168)',
            pointRadius: 0
        }

        let deceasedLine = {
            data: deceased,
            label: 'Deaths',
            fill: false,
            backgroundColor: 'rgb(232,69,69)',
            borderColor: 'rgb(232,69,69)',
            pointRadius: 0
        }

        let activeLine = {
            data: active,
            label: 'Active',
            fill: false,
            backgroundColor: 'rgb(106,44,112)',
            borderColor: 'rgb(106,44,112)',
            pointRadius: 0
        }

        let options = {
            title: {
                text: `COVID-19 India Trend: ${start_date} - ${end_date}`,
                display: true,
                fontColor: '#eeeeee'
            },
            legend: {
                labels: {
                    fontColor: '#eeeeee'
                }
            },
            scales: {
                xAxes: [{
                    ticks: {
                        display: false
                    },
                    scaleLabel: {
                        display:true,
                        labelString: 'Time',
                        fontColor: '#eeeeee'
                    },
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: '#eeeeee'
                    },
                    scaleLabel: {
                        display:true,
                        labelString: 'Cases',
                        fontColor: '#eeeeee'
                    }
                }]
            }
        };

        let casesChart = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [confirmedLine, activeLine, recoveredLine, deceasedLine]
            },
            options: options
        };

        try {
            const response = await axios.post('https://quickchart.io/chart/create', {chart: casesChart});

            const graphEmbed = new Discord.MessageEmbed()
                .setTitle(`COVID-19 India Trend: ${start_date} - ${end_date}`)
                .setImage(response.data.url);

            await message.channel.send(graphEmbed);
        } catch (e) {
            console.error(e);
            await errorMessage(message);
        }
    },
};