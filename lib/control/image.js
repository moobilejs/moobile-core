"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Image = moobile.Image = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__source: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__loaded: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__originalSize: {
		x: 0,
		y: 0
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	options: {
		tagName: 'img',
		preload: false,
		source: null
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
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didBuild: function() {
		this.parent();
		var source = this.options.source || this.element.get('src');
		if (source) this.setSource(source);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		if (this.__image) {
			this.__image.off('load', this.bound('__onLoad'));
			this.__image.src = 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
			this.__image = null;
		}

		this.element.set('src', 'data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');

		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#setSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSource: function(source, media) {

		if (media &&
			window.matchMedia &&
			window.matchMedia(media).matches === false)
			return this;

		this.__source = source || '';

		if (this.__image) {
			this.__image.off('load', this.bound('__onLoad'));
			this.__image = null;
		}

		if (source) {
			if (this.options.preload) {
				this.__loaded = false;
				this.__image = new Image();
				this.__image.src = source;
				this.__image.on('load', this.bound('__onLoad'));
			} else {
				this.__load();
			}
		} else {
			this.__unload();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#getSource
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSource: function() {
		return this.__source;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this.__image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#getOriginalSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getOriginalSize: function() {
		return this.__originalSize;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#isLoaded
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isLoaded: function() {
		return this.__loaded;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#isEmpty
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

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__load: function() {

		this.__loaded = true;

		if (this.options.preload) {
			this.__originalSize.x = this.__image.width;
			this.__originalSize.y = this.__image.height;
		}

		this.element.set('src', this.__source);
		this.show();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__unload: function() {

		this.__loaded = false;

		if (this.options.preload) {
			this.__originalSize.x = 0;
			this.__originalSize.y = 0;
		}

		this.element.erase('src');
		this.emit('unload');
		this.hide();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onLoad: function() {
		this.emit('preload');
		this.__load();
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Image#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Image.from = function(source) {
	if (source instanceof Image) return source;
	var image = new Image();
	image.setSource(source);
	return image;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('image', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(Image, element, 'data-image'));
});