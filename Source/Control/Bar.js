/*
---

name: Bar

description: Provide the base class for a Bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- BarRoles	
	- BarStyle

provides:
	- Bar

...
*/

Moobile.Bar = new Class({

	Extends: Moobile.Control,

	options: {
		className: 'bar'
	},
	
	item: null,
	
	addBarButton: function(item, where, context) {
		return this.item.addChild(item, where, context);
	},

	getBarButton: function(name) {
		return this.item.getChild(name);
	},

	removeBarButton: function(item) {
		return this.item.removeChild(item);
	},

	clearBarButtons: function() {
		return this.item.removeChildren();
	},

	setItem: function(item) {
		this.replaceChild(this.item, item);
		this.item.destroy();
		this.item = item;
		return this;		
	},

	getItem: function() {
		return this.item;
	},
	
	rolesWillLoad: function() {
		
		this.parent();
		
		var item = this.getRoleElement('item');
		if (item == null) {
			item = new Element('div');
			item.ingest(this.element);
			item.inject(this.element);
		}
		
		this.setRole('item', item);
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar', null, function(element, options, name) {

	var instance = Class.instantiate(element.get('data-bar') || Moobile.Bar, element, options, name);
	if (instance instanceof Moobile.Bar) {
		this.addChild(instance);
	}	
	
	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('item', Moobile.Bar, function(element, options, name) {

	var instance = Class.instantiate(element.get('data-item') || Moobile.BarItem, element, options, name);
	if (instance instanceof Moobile.BarItem) {
		this.addChild(instance);
		this.item = instance;
	}	
	
	return instance;
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('translucent', Moobile.Bar, {
	attach: function(element) { element.addClass('style-translucent'); },			
	detach: function(element) { element.removeClass('style-translucent'); }			
});

Moobile.Entity.defineStyle('black', Moobile.Bar, {
	attach: function(element) { element.addClass('style-black'); },			
	detach: function(element) { element.removeClass('style-black'); }			
});

Moobile.Entity.defineStyle('black-translucent', Moobile.Bar, {
	attach: function(element) {
		element
			.addClass('style-black')
			.addClass('style-black-translucent');
	},			
	detach: function(element) {
		element
			.removeClass('style-black')
			.removeClass('style-black-translucent');
	}
});
