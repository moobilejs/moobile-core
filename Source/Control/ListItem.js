/*
---

name: ListItem

description: Provide a ListItem control used inside a List control.

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

	accessory: null,

	options: {
		className: 'list-item'
	},

	build: function(element) {
		
		element = document.id(element) || new Element('li');
		
		this.parent(element);

		this.set('role', 'list-item');

		var label = this.getElement('[data-role=label]:not([data-task])');
		var image = this.getElement('[data-role=image]:not([data-task])');

		var accessory = this.getElement('[data-role=label][data-task=accessory]');
		if (accessory == null) {
			accessory = new Element('div[data-role=label][data-task=accessory]');
		}
		
		if (label == null) {
			label = new Element('div[data-role=label]');
			label.ingest(this.content);
		}

		if (image == null) {
			image = new Element('div[data-role=image]');
		}

		image.inject(this.element, 'top');
		label.inject(this.content, 'top');
		accessory.inject(this.element);

		this.label = this.getRoleInstance(label);
		this.image = this.getRoleInstance(image);		
		this.accessory = this.getRoleInstance(accessory);
	
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