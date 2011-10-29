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

	setup: function() {

		this.parent();
		
		if (this.label == null) {
			this.label = new Element('div');
			this.label.ingest(this.element);
			this.label.inject(this.element);
			this.setRole('label', this.label);
		}

		return this;
	},
	
	teardown: function() {
		this.parent();
		this.label = null;
		return this;
	},

	setLabel: function(label) {

		if (this.label ===  label)
			return this;

		this.label.set('html', null);
		this.label.hide();

		if (label) {
			if (typeof type == 'string') {
				this.label.set('html', label);
				this.label.show();
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

	onMouseDown: function(e) {
		this.parent(e);
		this.element.addClass(this.options.className + '-down');
	},

	onMouseUp: function(e) {
		this.parent(e);
		this.element.removeClass(this.options.className + '-down');
	}

});

/**
 * @role button
 */
Moobile.Entity.defineRole('button', null, function(element, options, name) {
	
	var instance = Class.instanciate(element.get('data-button') || Moobile.Button, element, options, name);
	if (instance instanceof Moobile.Button) {
		this.addChild(instance);
	}	
	
	return instance;
});

/**
 * @role label
 */
Moobile.Entity.defineRole('label', Moobile.Button, function(element, options, name) {
	
	var instance = Class.instanciate(element.get('data-label') || Moobile.Entity, element, options, name);
	if (instance instanceof Moobile.Entity) {
		this.addChild(instance);
	}
	
	this.label = instance;
	
	return instance;
});
