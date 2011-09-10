/*
---

name: BarTitle

description:

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

	build: function(element) {
		this.parent(element);
		this.set('role', 'bar-title');
		return this;
	},

	setText: function(text) {

		this.destroyChildViews();

		if (this.text) {
			this.text = '';
		}

		if (text) {
			this.text = text;
		}

		this.content.set('html', this.text);

		return this;
	},

	getText: function() {
		return this.text;
	}

});