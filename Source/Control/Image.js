/*
---

name: Image

description: Provides a control that display an image.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Image

...
*/

 /**
 * @name  Image
 * @class Provides an image control.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends Control
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Image = new Class( /** @lends Image.prototype */ {

	Extends: Moobile.Control,

	/**
	 * @var    {Object} The class options.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'img'
	},

	/**
	 * Sets the image source.
	 *
	 * This method will set the source of the image if this image's element is
	 * an image element.
	 *
	 * @param {String} source The image source.
	 *
	 * @return {Image} This image.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSource: function(source) {

		if (this.element.get('tag') == 'img') {
			this.element.set('src', source);
			this.show();
		}

		return this;
	},

	/**
	 * Returns the image source.
	 *
	 * This method will return this source of the image if this image's element
	 * is an image element.
	 *
	 * @return {String} The image source.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSource: function() {
		return this.element.get('src');
	},

	destroy: function() {
		this.image = null;
		this.parent();
	},

	willLoad: function() {
		this.parent();
		var source = this.getSource();
		if (source.trim() == '') {
			this.hide();
		}
	},

	didLoad: function() {
		this.parent();
		this.element.addClass('image');
	}
});
