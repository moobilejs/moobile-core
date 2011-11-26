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
 * Provides a control that groups bar button.
 *
 * @name BarButtonGroup
 * @class BarButtonGroup
 * @extends ButtonGroup
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.BarButtonGroup = new Class( /** @lends BarButtonGroup.prototype */ {

	Extends: Moobile.ButtonGroup,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'bar-button-group'
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar-button-group', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-bar-button-group') || Moobile.BarButtonGroup, element, null, name);
	if (instance instanceof Moobile.BarButtonGroup) {
		this.addChild(instance);
	}

	return instance;
});
