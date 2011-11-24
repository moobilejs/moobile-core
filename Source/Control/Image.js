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

	Extends: Moobile.Entity,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'image',
		tagName: 'img'
	},

	setSource: function(source) {

		this.element.set('src', null);
		this.element.hide();

		if (source) {
			this.element.set('src', image);
			this.element.show();
		}

		return this;
	},

	getSource: function() {
		return this.element.get('src');
	},

	destroy: function() {
		this.image = null;
		this.parent();
	}

});
