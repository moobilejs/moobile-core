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
 * @see    http://moobilejs.com/doc/latest/Control/Image
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Image = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_source: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_loaded: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_originalSize: {
		x: 0,
		y: 0
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'img',
		preload: false
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.hide();
		this.addClass('image');

		var source = this.element.get('src');
		if (source) {
			this.setSource(source);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		if (this._image) {
			this._image.removeEvent('load', this.bound('_onLoad'));
			this._image.src = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
			this._image = null;
		}

		this.element.set('src', 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

		this.parent();
	},


	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#setSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSource: function(source) {

		this._source = source || '';

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
	 * @see    http://moobilejs.com/doc/latest/Control/Image#getSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSource: function() {
		return this._source;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this._image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#getOriginalSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getOriginalSize: function() {
		return this._originalSize;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#isLoaded
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isLoaded: function() {
		return this._loaded;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Image#isEmpty
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	isEmpty: function() {
		return !this.getSource();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	show: function() {
		return this.isEmpty() ? this : this.parent();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_load: function() {

		this._loaded = true;

		if (this.options.preload) {
			this._originalSize.x = this._image.width;
			this._originalSize.y = this._image.height;
		}

		this.element.set('src', this._source);
		this.show();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_unload: function() {

		this._loaded = false;

		if (this.options.preload) {
			this._originalSize.x = 0;
			this._originalSize.y = 0;
		}

		this.element.erase('src');
		this.fireEvent('unload');
		this.hide();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onLoad: function() {
		this.fireEvent('preload');
		this._load();
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Control/Image#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Image.from = function(source) {
	if (source instanceof Moobile.Image) return source;
	var image = new Moobile.Image();
	image.setSource(source);
	return image;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('image', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Image, element, 'data-image'));
});