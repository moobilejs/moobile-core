/*
---

name: ListItem

description: Provides a list item control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ListItem

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/ListItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.ListItem = new Class({

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
	_label: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_detail: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'li'
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
	 * @since  0.1.0
	 */
	destroy: function() {
		this._label = null;
		this._image = null;
		this._detail = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this._label === label)
			return this;

		label = Moobile.Text.from(label);

		if (this._label) {
			this._label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this._label = label;
		this._label.addClass('list-item-label');
		this.toggleClass('list-item-label-empty', this._label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this._label;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setImage: function(image) {

		if (this._image === image)
			return this;

		image = Moobile.Image.from(image);

		if (this._image) {
			this._image.replaceWithComponent(image, true);
		} else {
			this.addChildComponent(image);
		}

		this._image = image;
		this._image.addClass('list-item-image');
		this.toggleClass('list-item-image-empty', this._image.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this._image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#setDetail
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setDetail: function(detail) {

		if (this._detail === detail)
			return this;

		detail = Moobile.Text.from(detail);

		if (this._detail) {
			this._detail.replaceWithComponent(detail, true);
		} else {
			this.addChildComponent(detail);
		}

		this._detail = detail;
		this._detail.addClass('list-item-detail');
		this.toggleClass('list-item-detail-empty', this._detail.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#getDetail
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getDetail: function() {
		return this._detail;
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
 * @see    http://moobilejs.com/doc/latest/Control/ListItem#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.ListItem.from = function(source) {
	if (source instanceof Moobile.ListItem) return source;
	var item = new Moobile.ListItem();
	item.setLabel(source);
	return item;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('item', Moobile.List, null, function(element) {
	this.addItem(Moobile.Component.create(Moobile.ListItem, element, 'data-item'));
});

Moobile.Component.defineRole('header', Moobile.List, null, function(element) {
	this.addItem(Moobile.Component.create(Moobile.ListItem, element, 'data-item').setStyle('header'));
});

Moobile.Component.defineRole('image', Moobile.ListItem, null, function(element) {
	this.setImage(Moobile.Component.create(Moobile.Image, element, 'data-image'));
});

Moobile.Component.defineRole('label', Moobile.ListItem, null, function(element) {
	this.setLabel(Moobile.Component.create(Moobile.Text, element, 'data-label'));
});

Moobile.Component.defineRole('detail', Moobile.ListItem, null, function(element) {
	this.setDetail(Moobile.Component.create(Moobile.Text, element, 'data-detail'));
});

// <0.1-compat>
/**
 * @deprecated
 */
Moobile.Component.defineRole('list-item', Moobile.List, null, function(element) {
	console.log('[DEPRECATION NOTICE] The role "list-item" will be removed in 0.4, use the role "item" instead');
	this.addItem(Moobile.Component.create(Moobile.ListItem, element, 'data-list-item'));
});
// </0.1-compat>

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/* Header Style - iOS Android */
Moobile.Component.defineStyle('header', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-header'); },
	detach: function(element) { element.removeClass('style-header'); }
});

/* Checked Style - iOS */
Moobile.Component.defineStyle('checked', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-checked'); },
	detach: function(element) { element.removeClass('style-checked'); }
});

/* Disclosed Style - iOS */
Moobile.Component.defineStyle('disclosed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-disclosed'); },
	detach: function(element) { element.removeClass('style-disclosed'); }
});

/* Detailed Style - iOS */
Moobile.Component.defineStyle('detailed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-detailed'); },
	detach: function(element) { element.removeClass('style-detailed'); }
});
