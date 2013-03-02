"use strict"

require('../request');

/**
 * @see    http://moobilejs.com/doc/latest/Element/Element#from
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

/**
 * @see    http://moobilejs.com/doc/latest/Element/Element#at
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
Element.at = function(path, callback) {

	var dispatch = function(element) {
		if (callback) callback(element)
	}

	var element = cache[path] || null
	if (element) {
		element = element.clone(true, true)
		dispatch(element)
		return element
	}

	var onSuccess = function(response) {
		dispatch(element = cache[path] = Element.from(response))
	}

	onFailure: function() {
		dispatch(null)
	}

	var async = typeof callback === 'function'

	new Request({
		url: path,
		async: async,
		method: 'get',
		onSuccess: onSuccess,
		onFailure: onFailure
	}).send()

	return element
};

var cache = {};