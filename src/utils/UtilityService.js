const UtilityService = {
	addCommas: (n) => {
		return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	toPercentage: (n) => {
		return ( (n * 100).toFixed(2) ).toString() + "%";
	},
	getYesterday: () => {
		const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().slice(0,10);
	}
};

export default UtilityService;