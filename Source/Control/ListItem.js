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

	setLabel: function(label) {

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

	getLabel: function() {
		return this.label;
	},

	setImage: function(image) {

		if (this.image === image)
			return this;

		if (image) {

			if (typeof image == 'string') {
				this.image.setSource(image);
			} else {
				this.replaceChildView(this.image, image);
				this.image.destroy();
				this.image = image;				
			}
		}

		return this;
	},

	getImage: function() {
		return this.image;
	},
	
	setInfos: function(infos) {

		if (this.infos === infos)
			return this;

		this.infos.setText(null);

		if (infos) {
			if (typeof infos == 'string') {
				this.infos.setText(infos);
			} else {
				this.replaceChildView(this.infos, infos);
				this.infos.destroy();
				this.infos = infos;				
			}
		}

		return this;
	},

	getInfos: function() {
		return this.infos;
	},
	
	willLoad: function() {
		
		this.parent();

		var image = this.getRoleElement('image');
		var label = this.getRoleElement('label');
		var infos = this.getRoleElement('infos');
		
		if (label == null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
		}

		if (image == null) {
			image = new Element('div');
			image.inject(this.element, 'top');
		}
		
		if (infos == null) {
			infos = new Element('div');
			infos.inject(this.element);
		}
		
		this.defineElementRole(label, 'label');
		this.defineElementRole(image, 'image');
		this.defineElementRole(infos, 'infos');
	},
	
	willUnload: function() {
		
		this.label = null;
		this.image = null;
		this.infos = null;
		
		this.parent();
	}

});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('label', Moobile.ListItem, function(element, name) {
	
	var instance = Class.instantiate(element.get('data-label') || Moobile.Label, element, null, name);
	if (instance instanceof Moobile.Label) {
		this.addChild(instance);
		this.label = instance;
	}				
				
	return instance;
});


Moobile.Entity.defineRole('image', Moobile.ListItem, function(element, name) {
	
	var instance = Class.instantiate(element.get('data-image') || Moobile.Image, element, null, name);
	if (instance instanceof Moobile.Image) {
		this.addChild(instance);
	}

	this.image = instance;
	
	if (!this.image.getSource()) {
		this.image.hide();
	}
	
	return instance;	
});

Moobile.Entity.defineRole('infos', Moobile.ListItem, function(element, name) {
	
	var instance = Class.instantiate(element.get('data-infos') || Moobile.Label, element, null, name);
	if (instance instanceof Moobile.Label) {
		this.addChild(instance);
	}

	this.detail = instance;
	this.detail.getElement().addClass('infos');	

	return instance;
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
