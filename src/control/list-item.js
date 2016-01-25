"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
var ListItem = moobile.ListItem = new Class({

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
	__label: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__detail: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	options: {
		tagName: 'li',
		image: null,
		label: null,
		detail: null,
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('list-item');

		var image  = this.getRoleElement('image');
		var label  = this.getRoleElement('label');
		var detail = this.getRoleElement('detail');

		if (label === null) {
			label = document.createElement('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		if (image === null) {
			image = document.createElement('img');
			image.inject(this.element, 'top');
			image.setRole('image');
		}

		if (detail === null) {
			detail = document.createElement('div');
			detail.inject(this.element);
			detail.setRole('detail');
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
		var detail = this.options.detail;

		if (image) this.setImage(image);
		if (label) this.setLabel(label);
		if (detail) this.setDetail(detail);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.__label = null;
		this.__image = null;
		this.__detail = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this.__label === label)
			return this;

		label = moobile.Text.from(label);

		if (this.__label) {
			this.__label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this.__label = label;
		this.__label.addClass('list-item-label');
		this.toggleClass('list-item-label-empty', this.__label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this.__label;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setImage: function(image) {

		if (this.__image === image)
			return this;

		image = moobile.Image.from(image);

		if (this.__image) {
			this.__image.replaceWithComponent(image, true);
		} else {
			this.addChildComponent(image);
		}

		this.__image = image;
		this.__image.addClass('list-item-image');
		this.toggleClass('list-item-image-empty', this.__image.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this.__image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#setDetail
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setDetail: function(detail) {

		if (this.__detail === detail)
			return this;

		detail = moobile.Text.from(detail);

		if (this.__detail) {
			this.__detail.replaceWithComponent(detail, true);
		} else {
			this.addChildComponent(detail);
		}

		this.__detail = detail;
		this.__detail.addClass('list-item-detail');
		this.toggleClass('list-item-detail-empty', this.__detail.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#getDetail
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getDetail: function() {
		return this.__detail;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	shouldAllowState: function(state) {

		if (this.hasStyle('header') && (state === 'highlighted' || state === 'selected' || state === 'disabled')) {
			return false;
		}

		return this.parent(state);
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/moobile.ListItem#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
moobile.ListItem.from = function(source) {
	if (source instanceof moobile.ListItem) return source;
	var item = new moobile.ListItem();
	item.setLabel(source);
	return item;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('item', moobile.List, null, function(element) {
	this.addItem(moobile.Component.create(moobile.ListItem, element, 'data-item'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
moobile.Component.defineRole('header', moobile.List, null, function(element) {
	this.addItem(moobile.Component.create(moobile.ListItem, element, 'data-item').setStyle('header'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('image', moobile.ListItem, null, function(element) {
	this.setImage(moobile.Component.create(moobile.Image, element, 'data-image'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('label', moobile.ListItem, null, function(element) {
	this.setLabel(moobile.Component.create(moobile.Text, element, 'data-label'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('detail', moobile.ListItem, null, function(element) {
	this.setDetail(moobile.Component.create(moobile.Text, element, 'data-detail'));
});

// <0.1-compat>

/**
 * @deprecated
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
moobile.Component.defineRole('list-item', moobile.List, null, function(element) {
	console.log('[DEPRECATION NOTICE] The role "list-item" will be removed in 0.4, use the role "item" instead');
	this.addItem(moobile.Component.create(moobile.ListItem, element, 'data-list-item'));
});

// </0.1-compat>

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/**
 * Header Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
moobile.Component.defineStyle('header', moobile.ListItem, {
	attach: function(element) { element.addClass('style-header'); },
	detach: function(element) { element.removeClass('style-header'); }
});

/**
 * Checked Style - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('checked', moobile.ListItem, {
	attach: function(element) { element.addClass('style-checked'); },
	detach: function(element) { element.removeClass('style-checked'); }
});

/**
 * Disclosed Style - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('disclosed', moobile.ListItem, {
	attach: function(element) { element.addClass('style-disclosed'); },
	detach: function(element) { element.removeClass('style-disclosed'); }
});

/**
 * Detailed Style - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('detailed', moobile.ListItem, {
	attach: function(element) { element.addClass('style-detailed'); },
	detach: function(element) { element.removeClass('style-detailed'); }
});
