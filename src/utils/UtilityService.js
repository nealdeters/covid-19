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
	},
	getTotals: (iso, data) => {
		let total = null;
		if(iso){
		  total = {
		    active: 0,
		    active_diff: 0,
		    confirmed: 0,
		    confirmed_diff: 0,
		    recovered: 0,
		    recovered_diff: 0,
		    deaths: 0,
		    deaths_diff: 0,
		    fatality_rate: 0,
		    name: null,
		    subName: null
		  }

		  data.forEach(item => {
		    total.active += item.active;
		    total.confirmed += item.confirmed;
		    total.recovered += item.recovered;
		    total.deaths += item.deaths;
		    total.fatality_rate += item.fatality_rate;
		    total.active_diff += item.active_diff;
		    total.confirmed_diff += item.confirmed_diff;
		    total.recovered_diff += item.recovered_diff;
		    total.deaths_diff += item.deaths_diff;

		    if(!total.name){
		      total.name = item.region.name;
		      total.subName = item.region.province
		    }
		  })

		  total.fatality_rate = total.fatality_rate / data.length;
		} else {
		  total = data;
		}

		for(let key in total){
        if(key === 'fatality_rate'){
          total[key] = UtilityService.toPercentage(total[key]);
        } else {
          if(typeof total[key] === 'number'){
            total[key] = UtilityService.addCommas(total[key] > 0 ? total[key] : 0);
          }
        } 
      }

		return total;
	}
};

export default UtilityService;