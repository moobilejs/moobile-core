/*
---

name: BarButtonGroup

description: Provides a wrapper for many BarButton controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ButtonGroup

provides:
	- BarButtonGroup

...
*/

Moobile.BarButtonGroup = new Class({

	Extends: Moobile.ButtonGroup,

	options: {
		className: 'bar-button-group'
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar-button-group', null, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-bar-button-group') || Moobile.BarButtonGroup, element, options, name);
	if (instance instanceof Moobile.BarButtonGroup) {
		this.addChild(instance);
	}
	
	return instance;	
});
