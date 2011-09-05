/*
---

name: Label

description: Provide a label

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

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

		this.element = document.id(element) || new Element('div');

		this.element.set('role', 'label');

		var text = this.getElement('[data-role=text]');
		if (text == null) {
			text = new Element('span[data-role=text]');
			text.ingest(this.element);
			text.inject(this.element);
		}

		this.text = text;

		var className = this.options.className;
		if (className) {
			this.element.addClass(className);
		}

		this.content = this.element;

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
	},

	getContent: function() {
		throw new Error('The content property is not available in this type of view.')
	}

});