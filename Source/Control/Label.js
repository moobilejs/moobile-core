/*
---

name: Label

description: Provides a view that contains some text.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Label

...
*/

Moobile.Label = new Class({

	Extends: Moobile.Entity,

	text: null,

	options: {
		className: 'label',
		tagName: 'span'
	},

	setText: function(text) {
		this.element.set('html', text);
		return this;
	},

	getText: function() {
		return this.element.get('html');
	}

});