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
	let stateData;
	try {
		stateData = await fetchAsync('https://api.covid19india.org/state_district_wise.json');
	} catch (e) {
		console.error(e);
		return false;
	}

	for (const i in stateData[state]['districtData']) {
		if (i === district) {
			return true;
		}
	}

	return false;
};

const checkValidState = async (state) => {
	let nationalData;
	try {
		nationalData = await fetchAsync('https://api.covid19india.org/data.json');
	} catch (e) {
		console.error(e);
		return false;
	}

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

const addWhiteSpace = (value, size) => {
	return value.padEnd(size).substring(0, size);
}

const errorMessage = async (message) => {
	message.channel.send('Sorry, the bot is not available right now!');
}

const fetchAsync = async (url) => {
	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}

module.exports = {
	toIndianFormat,
	checkValidDistrict,
	checkValidState,
	infermedica_axios,
	addWhiteSpace,
	errorMessage,
	fetchAsync
};
