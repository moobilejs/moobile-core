/*
---

name: Image

description: Provide an image view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Image

...
*/

Moobile.Image = new Class({

	Extends: Moobile.View,

	image: null,

	options: {
		className: 'image'
	},

	build: function(element) {

		this.element = document.id(element) || new Element('div');

		this.element.set('role', 'image');

		var image = this.getElement('img');
		if (image == null) {
			image = new Element('img')
			image.hide();
			image.inject(this.element);
		}

		this.image = image;

		var className = this.options.className;
		if (className) {
			this.element.addClass(className);
		}

		this.content = this.element;

		return this;
	},

	setImage: function(image) {

		this.image.set('src', null);
		this.image.hide();

		if (source) {
			this.image.set('src', image);
			this.image.show();
		}

		return this;
	},

	getImage: function() {
		return this.image.get('src');
	},

	getContent: function() {
		throw new Error('The content property is not available in this type of view.')
	}

});