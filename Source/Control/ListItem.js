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
	 * @var    {Image} The list item image.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	image: null,

	/**
	 * @var    {Label} The list item label.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	label: null,

	/**
	 * @var    {Label} The list item detail label.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	detail: null,

	/**
	 * Sets this list item's image.
	 *
	 * This method will set the image using either a string or an instance of
	 * am Image. When provided with a string, this methods instantiate a new
	 * Image and assign the given string as its source.
	 *
	 * @param {Mixed} image The image as either a string or Image.
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
	 * Return this list item's image.
	 *
	 * This method will always return an Image object even though the image may
	 * have been set using a string.
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
	 * Sets this list item's label.
	 *
	 * This method will set the label using either a string or an instance of a
	 * Label. When provided with a string, this methods instantiate a new Label
	 * and assign the given string as its text.
	 *
	 * @param {Mixed} label The label as either a string or Label.
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
	 * Return this list item's label.
	 *
	 * This method will always return a Label object even though the label may
	 * have been set using a string.
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
	 * Sets this list item's detail label.
	 *
	 * This method will set the detail label using either a string or an
	 * instance of a Label. When provided with a string, this methods
	 * instantiate a new Label and assign the given string as its text.
	 *
	 * @param {Mixed} detail The detail label as either a string or Label.
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
	 * Return this list item's detail label.
	 *
	 * This method will always return a Label object even though the label may
	 * have been set using a string.
	 *
	 * @return {Label} The detail label.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getDetail: function() {
		return this.detail;
	},

	destroy: function() {
		this.label = null;
		this.image = null;
		this.detail = null;
		this.parent();
	},

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

	didLoad: function() {
		this.parent();
		this.element.addClass('list-item');
	}
});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('list-item', Moobile.List, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-list-item', Moobile.ListItem);
	this.addItem(instance);
});

Moobile.Entity.defineRole('image', Moobile.ListItem, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-image', Moobile.Image);
	this.setImage(instance);
});

Moobile.Entity.defineRole('label', Moobile.ListItem, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-label', Moobile.Label);
	this.setLabel(instance);
});

Moobile.Entity.defineRole('detail', Moobile.ListItem, function(element, name) {
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
