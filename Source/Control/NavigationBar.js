/*
---

name: NavigationBar

description: Provides a NavigationBar control. 

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar
	- NavigationBarRoles

provides:
	- NavigationBar

...
*/

Moobile.NavigationBar = new Class({

	Extends: Moobile.Bar,
	
	addLeftBarButton: function(button) {
		return this.addBarButton(button, 'top');
	},
	
	addRightBarButton: function(button) {
		return this.addBarButton(button, 'bottom');
	},

	setTitle: function(title) {
		this.item.setTitle(title);
	},

	getTitle: function() {
		return this.item.title;
	},
	
	didLoad: function() {
		
		this.parent();
	
		if (this.options.className) {
			this.element.addClass('navigation-' + this.options.className);
		}
	}	

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('navigation-bar', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-navigation-bar') || Moobile.NavigationBar, element, null, name);
	if (instance instanceof Moobile.NavigationBar) {
		this.addChild(instance);
	}	
	
	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('item', Moobile.NavigationBar, function(element, name) {

	var instance = Class.instantiate(element.get('data-item') || Moobile.NavigationBarItem, element, null, name);
	if (instance instanceof Moobile.NavigationBarItem) {
		this.addChild(instance);
		this.item = instance;
	}	
		
	return instance;
});
