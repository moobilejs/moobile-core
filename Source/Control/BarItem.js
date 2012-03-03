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
 * @see    http://moobile.net/api/0.1/Control/BarItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.BarItem = new Class({

	Extends: Moobile.Control,

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('bar-item');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('item', Moobile.Bar, function(element) {
	this.setItem(Moobile.Component.create(Moobile.BarItem, element, 'data-item'));
});
