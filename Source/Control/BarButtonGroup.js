/*
---

name: BarButtonGroup

description: Provides a control that groups bar button.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ButtonGroup

provides:
	- BarButtonGroup

...
*/

/**
 * @see    http://moobile.net/api/0.1/Control/BarButtonGroup
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.BarButtonGroup = new Class({

	Extends: Moobile.ButtonGroup,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('bar-button-group');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('bar-button-group', null, function(element) {
	this.addChild(Moobile.Component.create(Moobile.BarButtonGroup, element, 'data-bar-button-group'));
});
