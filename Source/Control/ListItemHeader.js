/*
---

name: ListItemHeader

description: Provides a list item header control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ListItem

provides:
	- ListItemHeader

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/ListItemHEader
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.ListItemHeader = new Class({

	Extends: Moobile.ListItem,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('list-item-header');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('list-item-header', Moobile.List, null, function(element) {
	this.addItem(Moobile.Component.create(Moobile.ListItemHeader, element, 'data-list-item-header'));
});