/*
---

name: Element.Style.Vendor

description: Automatically adds vendor prefix to styles

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element
	- Core/Element.Event

provides:
	- Element.Style.Vendor

...
*/

(function() {

var setStyle = Element.prototype.setStyle;
var getStyle = Element.prototype.getStyle;

var prefixes = ['Khtml', 'O', 'Ms', 'Moz', 'Webkit'];

var cache = {};

Element.implement({

	getPrefixed: function(property) {

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
	},

	setStyle: function (property, value) {
		return setStyle.call(this, this.getPrefixed(property), value);
	},

	getStyle: function (property) {
		return getStyle.call(this, this.getPrefixed(property));
	}

});

})();
