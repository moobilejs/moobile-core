/*
---

name: Image

description: Provides a control that display an image.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Image

...
*/

/**
 * Provides a control that displays an image.
 *
 * @name Image
 * @class Image
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Image = new Class( /** @lends Image.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		tagName: 'img'
	},

	/**
	 * Set the image source.
	 * @param {String} source The image source.
	 * @return {Image}
	 * @since 0.1
	 */
	setSource: function(source) {

		this.element.set('src', null);
		this.element.hide();

		if (source) {
			this.element.set('src', image);
			this.element.show();
		}

		return this;
	},

	/**
	 * Return the image source.
	 * @return {String}
	 * @since 0.1
	 */
	getSource: function() {
		return this.element.get('src');
	},

	/**
	 * @see Entity#willLoad
	 */
	willLoad: function() {
		this.parent();
		if (!this.getSource()) this.element.hide();
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {
		this.parent();
		this.element.addClass('image');
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.image = null;
		this.parent();
	}

});
