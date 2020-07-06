const toIndianFormat = (number) => {
	number = number.toString();
	let lastThree = number.substring(number.length - 3);
	const otherNumbers = number.substring(0, number.length - 3);
	if (otherNumbers != '') {
		lastThree = ',' + lastThree;
	}
	const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
	return res;
};

module.exports = {
	toIndianFormat,
};
