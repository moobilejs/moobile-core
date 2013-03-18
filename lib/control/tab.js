"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var Tab = moobile.Tab = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_label: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_image: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	options: {
		label: null,
		image: null
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('tab');

		var image = this.getRoleElement('image');
		var label = this.getRoleElement('label');

		if (label === null) {
			label = document.createElement('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		if (image === null) {
			image = document.createElement('div');
			image.inject(this.element, 'top');
			image.setRole('image');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didBuild: function() {

		this.parent();

		var image = this.options.image;
		var label = this.options.label;

		if (image) this.setImage(image);
		if (label) this.setLabel(label);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	destroy: function() {
		this._label = null;
		this._image = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this._label === label)
			return this;

		label = moobile.Text.from(label);

		if (this._label) {
			this._label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this._label = label;
		this._label.addClass('tab-label');
		this.toggleClass('tab-label-empty', this._label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this._label;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setImage: function(image) {

		if (this._image === image)
			return this;

		image = moobile.Image.from(image);

		if (this._image) {
			this._image.replaceWithComponent(image, true);
		} else {
			this.addChildComponent(image);
		}

		this._image = image;
		this._image.addClass('tab-image');
		this.toggleClass('tab-image-empty', this._image.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getImage: function() {
		return this._image;
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Tab#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Tab.from = function(source) {
	if (source instanceof Tab) return source;
	var tab = new Tab();
	tab.setLabel(source);
	return tab;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('tab', moobile.TabBar, null, function(element) {
	this.addTab(moobile.Component.create(Tab, element, 'data-tab'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('label', Tab, null, function(element) {
	this.setLabel(moobile.Component.create(moobile.Text, element, 'data-label'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('image', Tab, null, function(element) {
	this.setImage(moobile.Component.create(moobile.Image, element, 'data-image'));
});

