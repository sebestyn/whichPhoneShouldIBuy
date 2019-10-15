var fonoapi = require('./index.js');
fonoapi.token = 'bb48887db376bf9d8c1b0e20ee347d9a770c811372512c8a';

var testModelStrings = [
	'galaxy s 5',	// returns empty
	'galaxy s5',
	'iphone', ' iphone', 'apple iphone'
];

testModelStrings.forEach(function (modelStr) {
	fonoapi.getDevices(fonoapi.printCount, modelStr);
});

fonoapi.getDevices(fonoapi.printCount, 'iphone', 'apple');

fonoapi.getLatest(fonoapi.printAllNames, 5);
fonoapi.getLatest(fonoapi.printAllNames, 5, 'apple');
