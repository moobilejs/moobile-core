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
 * @name  ListItem
 * @class Provides a list item control.
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
Moobile.ListItem = new Class( /** @lends ListItem.prototype */ {

	Extends: Moobile.Control,

	/**
	 * @var    {Image} The image.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	image: null,

	/**
	 * @var    {Label} The label.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	label: null,

	/**
	 * @var    {Label} The detail label.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	detail: null,

	destroy: function() {
		this.label = null;
		this.image = null;
		this.detail = null;
		this.parent();
	},

	/**
	 * Sets the image.
	 *
	 * This method will set the label using either a string or an instance of
	 * an `Image`. When provided with a string, this methods creates an `Image`
	 * instance and assign the given string as its source.
	 *
	 * @param {Mixed} image The image as a string or an `Image` instance.
	 *
	 * @return {ListItem} This list item.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setImage: function(image) {

		if (this.image === image)
			return this;

		if (typeof image == 'string') {
			var source = image;
			image = new Moobile.Image();
			image.setSource(text);
		}

		if (this.image == null) {
			this.image = image;
			this.addChild(image);
		} else {
			this.replaceChild(this.image, image);
			this.image.destroy();
			this.image = image;
		}

		return this;
	},

	/**
	 * Returns the image.
	 *
	 * @return {Image} The image.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this.image;
	},

	/**
	 * Sets the label.
	 *
	 * This method will set the label using either a string or an instance of a
	 * `Label`. When provided with a string, this methods creates a `Label`
	 * instance and assign the given string as its text.
	 *
	 * @param {Mixed} label The label as a string or `Label` instance.
	 *
	 * @return {ListItem} This list item.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this.label === label)
			return this;

		if (typeof label == 'string') {
			var text = label;
			label = new Moobile.Label();
			label.setText(text);
		}

		if (this.label == null) {
			this.label = label;
			this.addChild(label);
		} else {
			this.replaceChild(this.label, label);
			this.label.destroy();
			this.label = label;
		}

		return this;
	},

	/**
	 * Returns the label.
	 *
	 * @return {Label} The label.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this.label;
	},

	/**
	 * Sets the detail label.
	 *
	 * This method will set the label using either a string or an instance of a
	 * `Label`. When provided with a string, this methods creates a `Label`
	 * instance and assign the given string as its text.
	 *
	 * @param {Mixed} label The label as a string or `Label` instance.
	 *
	 * @return {ListItem} This list item.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setDetail: function(detail) {

		if (this.detail === detail)
			return this;

		if (typeof detail == 'string') {
			var text = detail;
			detail = new Moobile.Label();
			detail.setText(text);
		}

		if (this.detail == null) {
			this.detail = detail;
			this.addChild(detail);
		} else {
			this.replaceChild(this.detail, detail);
			this.detail.destroy();
			this.detail = label;
		}

		this.detail.addClass('detail');

		return this;
	},

	/**
	 * Returns the detail label.
	 *
	 * @return {Label} The detail label.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getDetail: function() {
		return this.detail;
	},

	willBuild: function() {

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

		this.attachRole(label, 'label');
		this.attachRole(image, 'image');
		this.attachRole(detail, 'detail');
	},

	didBuild: function() {
		this.parent();
		this.element.addClass('list-item');
	}
});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('list-item', Moobile.List, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-list-item', Moobile.ListItem);
	this.addItem(instance);
});

Moobile.Entity.defineRole('image', Moobile.ListItem, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-image', Moobile.Image);
	this.setImage(instance);
});

Moobile.Entity.defineRole('label', Moobile.ListItem, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-label', Moobile.Label);
	this.setLabel(instance);
});

Moobile.Entity.defineRole('detail', Moobile.ListItem, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-detail', Moobile.Label);
	this.setDetail(instance);
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
