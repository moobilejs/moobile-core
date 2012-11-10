/*
---

name: BarItem

description: Provides a control that represents the content of a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- BarItem

...
*/

 /**
 * @see    http://moobilejs.com/doc/latest/Control/BarItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
Moobile.BarItem = new Class({

	Extends: Moobile.Control,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('bar-item');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('item', Moobile.Bar, null, function(element) {
	console.log('[DEPRECATION NOTICE] The role "item" will be removed in 0.5, all the BarItem’s methods were moved to the "Bar" class.');
	this.setItem(Moobile.Component.create(Moobile.BarItem, element, 'data-item'));
});
