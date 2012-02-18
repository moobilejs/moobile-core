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
	 * The image.
	 * @type   Image
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	image: null,

	/**
	 * The label.
	 * @type   Text
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	label: null,

	/**
	 * The detail label.
	 * @type   Text
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	detail: null,

	options: {
		tagName: 'li'
	},

	willBuild: function() {

		this.parent();

		this.element.addClass('list-item');

		var image  = this.element.getRoleElement('image');
		var label  = this.element.getRoleElement('label');
		var detail = this.element.getRoleElement('detail');

		if (label === null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		if (image === null) {
			image = new Element('img');
			image.inject(this.element, 'top');
			image.setRole('image');
		}

		if (detail === null) {
			detail = new Element('div');
			detail.inject(this.element);
			detail.setRole('detail');
		}
	},

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

		if (typeof image === 'string') {
			var source = image;
			image = new Moobile.Image();
			image.setSource(text);
		}

		if (this.image === null) {
			this.image = image;
			this.addChild(image);
		} else {
			this.replaceChild(this.image, image, true);
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

		if (typeof label === 'string') {
			var text = label;
			label = new Moobile.Text();
			label.setText(text);
		}

		if (this.label === null) {
			this.label = label;
			this.addChild(label);
		} else {
			this.replaceChild(this.label, label, true);
			this.label.destroy();
			this.label = label;
		}

		this.label.addClass('label');

		return this;
	},

	/**
	 * Returns the label.
	 *
	 * @return {Text} The label.
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

		if (typeof detail === 'string') {
			var text = detail;
			detail = new Moobile.Text();
			detail.setText(text);
		}

		if (this.detail === null) {
			this.detail = detail;
			this.addChild(detail);
		} else {
			this.replaceChild(this.detail, detail, true);
			this.detail.destroy();
			this.detail = detail;
		}

		this.detail.addClass('detail');

		return this;
	},

	/**
	 * Returns the detail label.
	 *
	 * @return {Text} The detail label.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getDetail: function() {
		return this.detail;
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('list-item', Moobile.List, function(element) {
	var instance = Moobile.Component.create(Moobile.ListItem, element, 'data-list-item');
	this.addItem(instance);
});

Moobile.Component.defineRole('image', Moobile.ListItem, function(element) {
	var instance = Moobile.Component.create(Moobile.Image, element, 'data-image');
	this.setImage(instance);
});

Moobile.Component.defineRole('label', Moobile.ListItem, function(element) {
	var instance = Moobile.Component.create(Moobile.Text, element, 'data-label');
	this.setLabel(instance);
});

Moobile.Component.defineRole('detail', Moobile.ListItem, function(element) {
	var instance = Moobile.Component.create(Moobile.Text, element, 'data-detail');
	this.setDetail(instance);
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('checked', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-checked'); },
	detach: function(element) { element.removeClass('style-checked'); }
});

Moobile.Component.defineStyle('disclosed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-disclosed'); },
	detach: function(element) { element.removeClass('style-disclosed'); }
});

Moobile.Component.defineStyle('detailed', Moobile.ListItem, {
	attach: function(element) { element.addClass('style-detailed'); },
	detach: function(element) { element.removeClass('style-detailed'); }
});
