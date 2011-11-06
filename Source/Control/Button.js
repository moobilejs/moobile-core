/*
---

name: Button

description: Provides a Button control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Button

...
*/

Moobile.Button = new Class({

	Extends: Moobile.Control,
	
	label: null,

	options: {
		className: 'button',
	},
	
	teardown: function() {
		this.parent();
		this.label = null;
	},

	setLabel: function(label) {

		if (this.label === label)
			return this;

		this.label.setText(null);

		if (label) {
			if (typeof label == 'string') {
				this.label.setText(label);
			} else {
				this.replaceChild(this.label, label);
				this.label.destroy();
				this.label = label;				
			}
		}

		return this;
	},

	getLabel: function() {
		return this.label;
	},

	rolesWillLoad: function() {
		
		this.parent();
		
		var label = this.getRoleElement('label');
		if (label == null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
		}
		
		this.setRole('label', label);
	},

	onMouseDown: function(e) {
		this.parent(e);
		this.element.addClass(this.options.className + '-down');
	},

	onMouseUp: function(e) {
		this.parent(e);
		this.element.removeClass(this.options.className + '-down');
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('button', null, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-button') || Moobile.Button, element, options, name);
	if (instance instanceof Moobile.Button) {
		this.addChild(instance);
	}	
	
	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('label', Moobile.Button, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-label') || Moobile.Label, element, options, name);
	if (instance instanceof Moobile.Entity) {
		this.addChild(instance);
		this.label = instance;
	}
	
	return instance;
});
