const toIndianFormat = (number) => {
	number = number.toString();
	let lastThree = number.substring(number.length - 3);
	const otherNumbers = number.substring(0, number.length - 3);
	if (otherNumbers !== '') {
		lastThree = ',' + lastThree;
	}
	return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
};

const checkValidDistrict = (district, state, stateData) => {
	for (const i in stateData[state]['districtData']) {
		if (i === district) {
			return true;
		}
	}

	return false;
};

const checkValidState = (state, nationalData) => {
	for (const i in nationalData['statewise']) {
		const temp = nationalData['statewise'][i]['statecode'];
		if (temp === state) {
			return i;
		}
	}

	return -1;
};

module.exports = {
	toIndianFormat,
	checkValidDistrict,
	checkValidState
};
