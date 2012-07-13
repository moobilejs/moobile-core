/*
---

name: Element.From

description:

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Element

provides:
	- Element.From
	- Element.At

...
*/

(function() {

/**
 * @see    http://moobilejs.com/doc/latest/Element/Element.From#Element-from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Element.from = function(text) {

	switch (typeof text) {
		case 'object': return document.id(text);
		case 'string':
			var element = document.createElement('div');
			element.innerHTML = text;
			return element.childNodes[0] || null;
	}

	return null;
};

var elements = {};

/**
 * @see    http://moobilejs.com/doc/latest/Element/Element.From#Element-at
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Element.at = function(path, async, fn) {

	var element = elements[path];
	if (element) {
		var clone = element.clone(true, true);
		if (fn) fn(clone);
		return clone;
	}

	async = async || false;

	new Moobile.Request({
		method: 'get',
		async: async,
		url: path
	}).addEvent('success', function(response) {
		element = Element.from(response);
		if (fn) fn(element.clone(true, true));
	}).addEvent('failure', function(request) {
		if (fn) fn(null);
	}).send();

	if (element) elements[path] = element;

	return !async ? element.clone(true, true) : null;
};

})();