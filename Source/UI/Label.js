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

	Extends: Moobile.View,

	text: null,

	options: {
		className: 'label'
	},

	build: function(element) {

		this.parent(element);

		var text = this.getElement('[data-role=text]');
		if (text == null) {
			text = new Element('span');
			text.ingest(this.content);
			text.inject(this.content);
		}

		this.text = text;

		return this;
	},

	setText: function(text) {

		this.text.set('html', null);
		this.text.hide();

		if (text) {
			this.text.set('html', text);
			this.text.show();
		}

		return this;
	},

	getText: function() {
		return this.text.get('html');
	}

});