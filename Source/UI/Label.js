/*
---

name: Label

description: Provide a label

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

		this.element.set('role', 'label');

		var text = this.getElement('[data-role=text]');
		if (text == null) {
			text = new Element('span[data-role=text]');
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