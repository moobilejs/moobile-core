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
 * @see    http://moobilejs.com/doc/0.1/Control/Image
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Image = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_source: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_loaded: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_originalSize: {
		x: 0,
		y: 0
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		tagName: 'img',
		preload: false
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		if (this.element.get('tag') !== 'img')
			throw new Error('Moobile.Image requires an <img> element.');

		this.element.addClass('image');

		this.hide();

		var source = this.element.get('src');
		if (source) {
			this.setSource(source);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._image = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Image#setSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSource: function(source) {

		this._source = source;

		if (this._image) {
			this._image.removeEvent('load', this.bound('_onLoad'));
			this._image = null;
		}

		if (source) {
			if (this.options.preload) {
				this._loaded = false;
				this._image = new Image();
				this._image.src = source;
				this._image.addEvent('load', this.bound('_onLoad'));
			} else {
				this._load();
			}
		} else {
			this._unload();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Image#getSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSource: function() {
		return this._source;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Image#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getImage: function() {
		return this._image;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Image#getOriginalSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getOriginalSize: function() {
		return this._originalSize;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Image#isLoaded
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isLoaded: function() {
		return this._loaded;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_load: function() {

		this._loaded = true;

		if (this.options.preload) {
			this._originalSize.x = 0;
			this._originalSize.y = 0;
		}

		this.element.set('src', this._source);
		this.fireEvent('load');
		this.show();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_unload: function() {

		this._loaded = false;

		if (this.options.preload) {
			this._originalSize.x = this._image.width;
			this._originalSize.y = this._image.height;
		}

		this.element.erase('src');
		this.fireEvent('unload');
		this.hide();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onLoad: function() {
		this._load();
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('image', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Image, element, 'data-image'));
});