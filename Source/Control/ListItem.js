/*
---

name: ListItem

description: Provides a list item control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ListItemRoles
	- ListItemStyle

provides:
	- ListItem

...
*/

/**
 * Provides a list item control.
 *
 * @name ListItem
 * @class ListItem
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ListItem = new Class( /** @lends ListItem.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The list item image.
	 * @type {Image}
	 */
	image: null,

	/**
	 * The list item label.
	 * @type {Label}
	 */
	label: null,

	/**
	 * The list item info text.
	 * @type {Label}
	 */
	detail: null,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'list-item'
	},

	/**
	 * Set the list item image.
	 * @param {Mixed} image The image as an Image instance or as a string.
	 * @return {ListItem}
	 * @since 0.1
	 */
	setImage: function(image) {

		// TODO: empècher setter null

		if (this.image === image)
			return this;

		if (image) {

			if (typeof image == 'string') {
				this.image.setSource(image);
			} else {
				this.replaceChild(this.image, image);
				this.image.destroy();
				this.image = image;
			}
		}

		return this;
	},

	/**
	 * Return the image.
	 * @return {Image}
	 * @since 0.1
	 */
	getImage: function() {
		return this.image;
	},

	/**
	 * Set the list item label label.
	 * @param {Mixed} label The label as a Label instance or as a string.
	 * @return {ListItem}
	 * @since 0.1
	 */
	setLabel: function(label) {

		// TODO: empècher setter null

		if (this.label === label)
			return this;

		this.label.setText(null);

		if (label) {
			if (typeof label == 'string') {
				this.label.setText(label);
			} else {
				this.replaceChildView(this.label, label);
				this.label.destroy();
				this.label = label;
			}
		}

		return this;
	},

	/**
	 * Return the list item label.
	 * @return {Label}
	 * @since 0.1
	 */
	getLabel: function() {
		return this.label;
	},

	/**
	 * Set the list item infos.
	 * @param {Mixed} infos The infos as a Label instance or as a string.
	 * @return {Object}
	 * @since 0.1
	 */
	setDetail: function(infos) {

		// TODO: empècher setter null

		if (this.detail === infos)
			return this;

		this.detail.setText(null);

		if (infos) {
			if (typeof infos == 'string') {
				this.detail.setText(infos);
			} else {
				this.replaceChild(this.detail, infos);
				this.detail.destroy();
				this.detail = infos;
			}
		}

		return this;
	},

	/**
	 * Return the infos.
	 * @return {Label} The infos.
	 * @since 0.1
	 */
	getDetail: function() {
		return this.detail;
	},

	/**
	 * @see Entity#willLoad
	 */
	willLoad: function() {

		this.parent();

		var image  = this.getRoleElement('image');
		var label  = this.getRoleElement('label');
		var detail = this.getRoleElement('detail');

		if (label == null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
		}

		if (image == null) {
			image = new Element('div');
			image.inject(this.element, 'top');
		}

		if (detail == null) {
			detail = new Element('div');
			detail.inject(this.element);
		}

		this.defineElementRole(label, 'label');
		this.defineElementRole(image, 'image');
		this.defineElementRole(detail, 'detail');
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.label = null;
		this.image = null;
		this.detail = null;
		this.parent();
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('list-item', Moobile.List, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-list-item', Moobile.ListItem);
	this.addChild(instance);
});

Moobile.Entity.defineRole('image', Moobile.ListItem, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-image', Moobile.Image);
	this.addChild(instance);
	this.image = instance;
});

Moobile.Entity.defineRole('label', Moobile.ListItem, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-label', Moobile.Label);
	this.addChild(instance);
	this.label = instance;
});

Moobile.Entity.defineRole('detail', Moobile.ListItem, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-detail', Moobile.Label);
	this.addChild(instance);
	this.detail = instance;
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('checked', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-checked'); },
	detach: function(element) { element.removeClass('style-checked'); }
});

Moobile.Entity.defineStyle('disclosed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-disclosed'); },
	detach: function(element) { element.removeClass('style-disclosed'); }
});

Moobile.Entity.defineStyle('detailed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-detailed'); },
	detach: function(element) { element.removeClass('style-detailed'); }
});
