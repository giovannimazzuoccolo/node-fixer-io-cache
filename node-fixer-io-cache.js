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
			//console.log(result.rates);
			rateCache.set("cachedRates",{"request":request, "data" : result.rates});
			return callback(result.rates);
		});



	}).on("error", (err) => {
  	console.log("Error: " + err.message);
});

}


function eurTo(amount,currency,callback) {
	console.log('currency',currency);
	connect('https://api.fixer.io/latest',(data) => {
			//console.log('data',data['ZAR']);
			return callback(false,amount * data[currency].toFixed(4));
		});
}

function toEur(amount,currency,callback) {
	connect('https://api.fixer.io/latest',(data) => {
				console.log('exchange',data[currency]);
			return callback(false,amount / data[currency].toFixed(4));
		});
}

function otherCurrencies(amount,from,to,callback) {
	connect('https://api.fixer.io/latest?symbols='+from.toUpperCase()+','+to.toUpperCase(),(data) => {
			return callback(false,((amount / data[from]).toFixed(4) * data[to]).toFixed(4));
	});
}


function ratesList() {
	connect('https://api.fixer.io/latest',(data) => {
				data['EUR'] = 1;
				console.log('rates',Object.keys(data));
		});
}

function convert(amount,from,to,callback) {


		if(from.length > 3 || to.length > 3) {
			err = 'Please enter a correct currency code, if you do not know all the currency code available, use the function ratesList()';
			callback(err,null);
		}

		if(from == "EUR") {
				eurTo(amount,to.toUpperCase(),(err,data) => {
						if(err) throw err;

							return callback(false,data);
			});
		} else if(to == 'EUR') {
				toEur(amount,from.toUpperCase(),(err,data) => {
						if(err) throw err;

							return callback(false,data);
			});

		} else {


			otherCurrencies(amount,from,to, (err,data) => {
				if(err) throw err;

					return callback(false,data)
		});


	}

}

function history(date,callback) {

}

/*convert(1,'USD','GBP',(err,response) => {
	console.log('usd-gbp',response);
});

convert(2,'EUR','GBP',(err,response) => {
	//if(err) throw err;
	console.log('sonoqui');
	console.log("response",response);
});
*/
/*convert(2,'GBP','EUR',(err,response) => {
	//if(err) throw err;
	console.log('sonoqui');
	console.log("response",response);
});
*/

//ratesList();
//module.export();
