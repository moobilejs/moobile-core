/*
---

name: Image

description: Provides a view that contains an image.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

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

		this.parent(element);

		var image = this.getElement('img');
		if (image == null) {
			image = new Element('img')
			image.hide();
			image.inject(this.content);
		}

		this.image = image;

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
	}

});