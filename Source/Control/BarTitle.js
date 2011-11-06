/*
---

name: BarTitle

description: Provides a view that contains the title of a Bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- BarTitle

...
*/

Moobile.BarTitle = new Class({

	Extends: Moobile.Control,

	text: null,

	options: {
		className: 'bar-title'
	},

	setText: function(text) {
	
		if (this.text) {
			this.text = '';
		}

		if (text) {
			this.text = text;
		}

		this.element.set('html', this.text);

		return this;
	},

	getText: function() {
		return this.text;
	}

});
