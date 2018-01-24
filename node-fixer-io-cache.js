const https = require('https');
const cache = require('node-cache');

const rateCache = new cache({ stdTTL: 100, checkperiod: 86000 });


function connect(request,callback) {
		https.get(request,(res) => {
		let data = '';


		res.on('data', (chunk) => {
    	data += chunk;
  	});


  	res.on('end', () => {
			let result = JSON.parse(data);
			console.log(result.rates);
			rateCache.set("cachedRates",{"request":request, "data" : result.rates});
			return callback(result.rates);
		});



	}).on("error", (err) => {
  	console.log("Error: " + err.message);
});



}


function convert(amount,from,to,callback) {


		if(from.length > 3 || to.length > 3) {
			err = 'Please enter a correct currency code, if you do not know all the currency code available, use the function ratesList()';
			callback(err,null);
		}

		/*if(from == "EUR") {
				connect('https://api.fixer.io/latest?base='+to.toUpperCase(),(data) => {
						return callback(((amount / 1).toFixed(4) * data[to]).toFixed(4));
					});
		}

		if(to == "EUR") {
				connect('https://api.fixer.io/latest?base='+from.toUpperCase(),(data) => {
						return callback(((amount / data[from]).toFixed(4) * 1).toFixed(4));
					});
		}*/


		connect('https://api.fixer.io/latest?symbols='+from.toUpperCase()+','+to.toUpperCase(),(data) => {
				return callback(null,((amount / data[from]).toFixed(4) * data[to]).toFixed(4));
			});


}

function history(date,callback) {

}

convert(1,'USD','GBP',(err,response) => {
	console.log(response);
});

convert(1,'EUR','ZAR',(err,response) => {
	console.log(response);
});

//module.export();
