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

	destroy: function() {
		this.image = null;
		this.parent();
	},

	/**
	 * Sets the image source.
	 *
	 * This method will set the image source into the `src` attribute of the
	 * element if this image's element is an `img`.
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
	 * This method will return the image source from the `src` attribute of the
	 * element if this image's element is an `img`.
	 *
	 * @return {String} The image source.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSource: function() {
		return this.element.get('src');
	},

	willBuild: function() {

		this.parent();

		this.hide();

		var source = this.getSource();
		if (source && source.trim()) {
			this.show();
		}
	},

	didBuild: function() {
		this.parent();
		this.element.addClass('image');
	}
});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('image', null, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-image', Moobile.Image);
	this.addChild(instance);
});