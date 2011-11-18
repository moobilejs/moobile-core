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
	
	willLoad: function() {
		
		this.parent();
		
		var item = this.getRoleElement('item');
		if (item == null) {
			item = new Element('div');
			item.ingest(this.element);
			item.inject(this.element);
		}
		
		this.defineElementRole(item, 'item');
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-bar') || Moobile.Bar, element, null, name);
	if (instance instanceof Moobile.Bar) {
		this.addChild(instance);
	}	
	
	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('item', Moobile.Bar, function(element, name) {

	var instance = Class.instantiate(element.get('data-item') || Moobile.BarItem, element, null, name);
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

Moobile.Entity.defineStyle('dark', Moobile.Bar, {
	attach: function(element) { element.addClass('style-dark'); },			
	detach: function(element) { element.removeClass('style-dark'); }			
});

Moobile.Entity.defineStyle('dark-translucent', Moobile.Bar, {
	attach: function(element) {
		element
			.addClass('style-dark')
			.addClass('style-dark-translucent');
	},			
	detach: function(element) {
		element
			.removeClass('style-dark')
			.removeClass('style-dark-translucent');
	}
});
