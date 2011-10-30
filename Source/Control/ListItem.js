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
	
	rolesWillLoad: function() {
		
		this.parent();

		var image = this.getRoleElement('image');
		var label = this.getRoleElement('label');
		var infos = this.getRoleElement('infos');
		
		if (label == null) {
			label = new Element('div[data-role=label]');
			label.ingest(this.element);
			label.inject(this.element);
		}

		if (image == null) {
			image = new Element('div[data-role=image]');
			image.inject(this.element, 'top');
		}
		
		if (infos == null) {
			infos = new Element('div[data-role=infos]');
			infos.inject(this.element);
		}
	}

});

/**
 * @role list-item
 */
Moobile.Entity.defineRole('list-item', Moobile.List, function(element, options, name) {

	var instance = Class.instantiate(element.get('data-list-item') || Moobile.ListItem, element, options, name);
	if (instance instanceof Moobile.ListItem) {
		this.addChild(instance);
	}
	
	return instance;
});

/**
 * @actor label
 */
Moobile.Entity.defineRole('label', Moobile.ListItem, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-label') || Moobile.Label, element, options, name);
	if (instance instanceof Moobile.Label) {
		this.addChild(instance);
	}				
	
	this.label = instance;
			
	return instance;
});

/**
 * @actor image
 */
Moobile.Entity.defineRole('image', Moobile.ListItem, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-image') || Moobile.Image, element, options, name);
	if (instance instanceof Moobile.Image) {
		this.addChild(instance);
	}

	this.image = instance;
	
	if (!this.image.getSource()) {
		this.image.hide();
	}
	
	return instance;	
});

/**
 * @actor detail
 */
Moobile.Entity.defineRole('infos', Moobile.ListItem, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-infos') || Moobile.Label, element, options, name);
	if (instance instanceof Moobile.Label) {
		this.addChild(instance);
	}

	this.detail = instance;
	this.detail.getElement().addClass('infos');	

	return instance;
});

/**
 * @style checked
 */
Moobile.Entity.defineStyle('checked', Moobile.ListItem, {
	attach: function(element) {
		element.addClass('style-checked');
	},
	detach: function(element) {
		element.removeClass('style-checked');
	}
});

/**
 * @style disclosed
 */
Moobile.Entity.defineStyle('disclosed', Moobile.ListItem, {
	attach: function(element) {
		element.addClass('style-disclosed');
	},
	detach: function(element) {
		element.removeClass('style-disclosed');
	}
});

/**
 * @style detailed
 */
Moobile.Entity.defineStyle('detailed', Moobile.ListItem, {
	attach: function(element) {
		element.addClass('style-detailed');
	},
	detach: function(element) {
		element.removeClass('style-detailed');
	}
});

/**
 * @style active
 */
Moobile.Entity.defineStyle('active', Moobile.ListItem, {
	attach: function(element) {
		var activity = element.getElement('div.list-item-activity');
		if (activity == null) {
			activity = new Element('div.list-item-activity');
			activity.inject(element);
		}
		element.addClass('style-activity');
	},
	detach: function(element) {
		var activity = element.getElement('div.list-item-activity');
		if (activity) {
			activity.destroy();
		}
		element.removeClass('style-activity');
	}
});