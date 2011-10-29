/*
---

name: ListItem

description: Provide a ListItem control used inside a List control.

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

Moobile.ListItem = new Class({

	Extends: Moobile.Control,

	label: null,

	image: null,

	accessory: null,

	options: {
		className: 'list-item'
	},

	build: function() {
						
		this.parent();

		var label = this.getRolePerformer('label');
		var image = this.getRolePerformer('image');

		var accessory = this.getRolePerformer('accessory');
		if (accessory == null) {
			accessory = new Element('div');
		}
		
		if (label == null) {
			label = new Element('div');
			label.ingest(this.content);
		}

		if (image == null) {
			image = new Element('div');
		}

		image.inject(this.element, 'top');
		label.inject(this.content, 'top');
		accessory.inject(this.element);

		this.label = this.applyRole(label, 'label');
		this.image = this.applyRole(image, 'image');		
		this.accessory = this.applyRole(accessory, 'accessory');
	
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