var httpreq = require('httpreq');

function getDevices(callback, device, brand) {
	var url = 'https://fonoapi.freshpixl.com/v1/getdevice';
	var options = {
		parameters: {device: device, token: module.exports.token},
		timeout: 2900
	};

	if (brand) {
		options.parameters.brand = brand;
	}

	httpreq.post(url, options, function (err, res) {
		if (err) {
			console.log(err);
		} else {
			var data = JSON.parse(res.body);
			var queryString = brand ? (brand + '.' + device) : device;
			callback(queryString, data);
		}
	});
}

function getLatest(callback, limit, brand) {
	var url = 'https://fonoapi.freshpixl.com/v1/getlatest';
	var options = {
		parameters: {token: module.exports.token},
		timeout: 2900
	};
	if (brand) {
		options.parameters.brand = brand;
	}
	if (limit) {
		options.parameters.limit = limit;
	}

	httpreq.post(url, options, function (err, res) {
		if (err) {
			console.log(err);
		} else {
			var data = JSON.parse(res.body);
			var queryString = brand ? brand : '';
			callback(queryString, data);
		}
	});
}

function printCount(queryString, data) {
	printData(queryString, data, false);
}

function printAllNames(queryString, data) {
	printData(queryString, data, true);
}

function printData(queryString, data, printAllData) {
	var outStr = '- "' + queryString + '"\t => ';

	if (data.hasOwnProperty('length')) {
		console.log(outStr + data.length + ' devices');

		if (printAllData) {
			data.forEach(function (device) {
				console.log(device.DeviceName);
			});
			console.log('---');
		}
	} else if (data.hasOwnProperty('message')) {
		console.log(outStr + data.message);
	} else {
		console.log(outStr + ' invalid data: ' + JSON.stringify(data));
	}
}

module.exports = {
	token: '',
	getDevices: getDevices,
	getLatest: getLatest,

	printCount: printCount,
	printAllNames: printAllNames
};
