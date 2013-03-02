"use strict"

var setStyle = Element.prototype.setStyle;
var getStyle = Element.prototype.getStyle;

var prefix = function(property) {

	property = property.camelCase();

	if (property in this.style)
		return property;

	if (cache[property] !== undefined)
		return cache[property];

	var suffix = property.charAt(0).toUpperCase() + property.slice(1);

	for (var i = 0; i < prefixes.length; i++) {
		var prefixed = prefixes[i] + suffix;
		if (prefixed in this.style) {
			cache[property] = prefixed;
			break
		}
	}

	if (cache[property] === undefined)
		cache[property] = property;

	return cache[property];
};

var prefixes = ['Khtml', 'O', 'Ms', 'Moz', 'Webkit'];

var cache = {};

Element.implement({

	setStyle: function (property, value) {
		return setStyle.call(this, prefix.call(this, property), value);
	},

	getStyle: function (property) {
		return getStyle.call(this, prefix.call(this, property));
	}

});