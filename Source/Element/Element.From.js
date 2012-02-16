/*
---

name: Element.From

description:

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Element.From
	- Element.At

...
*/

(function() {

/**
 * @see http://moobile.net/api/0.1/Element/Element.From#ElementFrom
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Element.from = function(text) {

	switch (typeof text) {
		case 'object': return document.id(text);
		case 'string': return Elements.from(text).pop();
	}

	return null;
};

var elements = {};

/**
 * @see http://moobile.net/api/0.1/Element/Element.From#ElementAt
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Element.at = function(path, async, fn) {

	var element = elements[path];
	if (element) {
		var clone = element.clone();
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
		if (fn) fn(element.clone());
	}).addEvent('failure', function(request) {
		if (fn) fn(null);
	}).send();

	if (element) elements[path] = element;

	return !async ? element.clone() : null;
};

})();