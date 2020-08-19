const fetch = require('node-fetch');
const axios = require('axios');

const toIndianFormat = (number) => {
	number = number.toString();
	let lastThree = number.substring(number.length - 3);
	const otherNumbers = number.substring(0, number.length - 3);
	if (otherNumbers !== '') {
		lastThree = ',' + lastThree;
	}
	return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
};

const checkValidDistrict = async (district, state) => {
	const stateData = await fetch('https://api.covid19india.org/state_district_wise.json')
		.then(response => response.json())
		.catch(error => console.error(error));

	for (const i in stateData[state]['districtData']) {
		if (i === district) {
			return true;
		}
	}

	return false;
};

const checkValidState = async (state) => {
	const nationalData = await fetch('https://api.covid19india.org/data.json')
		.then(response => response.json())
		.catch(error => console.error(error));

	for (const i in nationalData['statewise']) {
		const temp = nationalData['statewise'][i]['statecode'];
		if (temp === state) {
			return i;
		}
	}

	return -1;
};

const infermedica_axios = axios.create({
	baseURL: 'https://api.infermedica.com/covid19',
	headers: {
		'App-Id': process.env.INFERMEDICA_ID,
		'App-Key': process.env.INFERMEDICA_KEY
	}
});

module.exports = {
	toIndianFormat,
	checkValidDistrict,
	checkValidState,
	infermedica_axios
};
