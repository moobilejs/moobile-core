/*
---

name: ListItem

description: Provide an item of a list.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ListItemStyle

provides:
	- ListItem

...
*/

Moobile.ListItem = new Class({

	Extends: Moobile.Control,

	label: null,

	image: null,

	options: {
		className: 'list-item'
	},

	found: function(element) {
		return document.id(element) || new Element('li');
	},

	build: function(element) {

		this.parent(element);

		var label = this.getElement('[data-role=label]');
		var image = this.getElement('[data-role=image]');

		if (label == null) {
			label = new Element('div[data-role=label]');
			label.ingest(this.content);
			label.inject(this.content, 'bottom');
		}

		if (image == null) {
			image = new Element('div[data-role=image]');
			image.inject(this.content, 'top');
		}

		this.label = this.getRoleInstance(label);
		this.image = this.getRoleInstance(image);

		return this;
	},

	setLabel: function(label) {

		if (this.label == image)
			return this;

		this.label.setText(null);
		this.label.hide();

		if (label) {

			var type = typeOf(label);
			if (type == 'string') {
				this.label.setText(label);
				this.label.show();
				return this;
			}

			if (type == 'element') {
				label = new Moobile.Label(label);
			}

			this.replaceChildView(this.label, label);
			this.label.destroy();
			this.label = label;
		}

		return this;
	},

	getLabel: function() {
		return this.label;
	},

	setImage: function(image) {

		if (this.image == image)
			return this;

		this.image.setText(null);
		this.image.hide();

		if (image) {

			var type = typeOf(label);
			if (type == 'string') {
				this.image.setText(label);
				this.image.show();
				return this;
			}

			if (type == 'element') {
				image = new Moobile.Label(image);
			}

			this.replaceChildView(this.image, image);

			this.image.destroy();
			this.image = image;
		}

		return this;
	},

	getImage: function() {
		return this.image;
	}

});