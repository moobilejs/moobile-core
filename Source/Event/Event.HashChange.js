/*
---

name: Event.HashChange

description: Provides history based events

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Custom-Event/Element.defineCustomEvent

provides:
	- Event.HashChange

...
*/

(function() {

var count = 0;
var timer = null;
var value = null;

var check = function() {
	var hash = location.hash;
	if (hash !== value) {
		value = location.hash;
		window.fireEvent('hashchange', value.indexOf('#') == 0 ? value.substr(1) : value);
	}
};

Element.defineCustomEvent('hashchange', {

	onSetup: function() {
		if (++count === 1) timer = check.periodical(200);
	},

	onTeardown: function() {
		if (--count === 0) clearTimeout(timer);
	}
});

})();