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

	image: null,

	source: null,

	loaded: false,

	originalSize: {
		x: 0,
		y: 0
	},

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

			this.loaded = false;
			this.source = source;

			if (this.image) {
				this.image.removeEvent('load', this.bound('onLoad'));
				this.image = null;
			}

			this.image = new Image();
			this.image.src = source;
			this.image.addEvent('load', this.bound('onLoad'));
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
		return this.source;
	},

	getImage: function() {
		return this.image;
	},

	getOriginalSize: function() {
		return this.originalSize;
	},

	isLoaded: function() {
		return this.loaded;
	},

	willBuild: function() {

		this.parent();

		this.hide();

		this.element.addClass('image');

		if (this.element.get('tag') == 'img') {
			var source = this.element.get('src');
			if (source) {
				this.setSource(source);
			}
		}
	},

	destroy: function() {
		this.image = null;
		this.parent();
	},

	onLoad: function() {

		this.loaded = true;
		this.originalSize.x = this.image.width;
		this.originalSize.y = this.image.height;

		this.element.set('src', this.source);

		this.show();

		this.fireEvent('load');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('image', null, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-image', Moobile.Image);
	this.addChild(instance);
});