"use strict"

var setStyle = Element.prototype.setStyle;
var getStyle = Element.prototype.getStyle;

var vendors = ['Khtml', 'O', 'Ms', 'Moz', 'Webkit'];
var prefixes = {};

var prefix = function(property) {

	property = property.camelCase();

	if (property in this.style)
		return property;

	if (prefixes[property] !== undefined)
		return prefixes[property];

	var suffix = property.charAt(0).toUpperCase() + property.slice(1);

	for (var i = 0; i < vendors.length; i++) {
		var prefixed = vendors[i] + suffix;
		if (prefixed in this.style) {
			prefixes[property] = prefixed;
			break
		}
	}

	if (prefixes[property] === undefined)
		prefixes[property] = property;

	return prefixes[property];
};

Element.implement({

	 setRole: function(role) {
	 	return this.set('data-role', role);
	 },

	 getRole: function(role) {
	 	return this.get('data-role');
	 },

	setStyle: function (property, value) {
		return setStyle.call(this, prefix.call(this, property), value);
	},

	getStyle: function (property) {
		return getStyle.call(this, prefix.call(this, property));
	},

	ingest: function(element) {
		return this.adopt(document.id(element).childNodes);
	}

});

var cache = {};

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
		if (callback) callback(element);
	};

	var element = cache[path] || null;
	if (element) {
		element = element.clone(true, true);
		dispatch(element);
		return element;
	}

	var onSuccess = function(response) {
		dispatch(element = cache[path] = Element.from(response));
	};

	var onFailure = function() {
		dispatch(null);
	};

	var async = typeof callback === 'function';

	new Request({
		url: path,
		async: async,
		method: 'get',
		onSuccess: onSuccess,
		onFailure: onFailure
	}).send();

	return element;
};
