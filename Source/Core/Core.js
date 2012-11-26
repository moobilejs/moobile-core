/*
---

name: Core

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Core

...
*/

var Moobile = {
	version: '0.3-dev'
};

/* Temp stuff */

(function() {

	var times = {};
	var dates = {};

	console.monitor = function(label) {
		if (dates[label] === undefined) {
			dates[label] = Date.now();
			if (times[label] === undefined) {
				times[label] = 0;
			}
		} else {
			console.log('WTF', label);
		}
	};

	console.monitorEnd = function(label) {
		times[label] += Date.now() - dates[label];
		dates[label] = undefined;
	};

	console.monitorLog = function() {
		for (var k in times) {
			console.log(k + ' ' + times[k] + 'ms');
		}
	}

})()