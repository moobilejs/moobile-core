/*
---

name: Element.Styles

description: Provides extra methods to Element.Styles.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	Core/Element
	Core/Element.Style

provides:
	- Element.Styles

...
*/

Element.implement({

	removeStyle: function(style) {
		this.setStyle(style, null);
		return this;
	},

	removeStyles: function(styles) {
		for (var style in styles) this.removeStyle(style, styles[style]);
		return this;
	}

});