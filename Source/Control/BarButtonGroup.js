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
 * @name  BarButtonGroup
 * @class Provides a bar button group control.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * Note: The `button-group` role automatically creates a bar button if placed
 * inside a bar or bar item.
 *
 * @extends ButtonGroup
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.BarButtonGroup = new Class( /** @lends BarButtonGroup.prototype */ {

	Extends: Moobile.ButtonGroup,

	willBuild: function() {
		this.parent();
		this.element.addClass('bar-button-group');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar-button-group', null, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-bar-button-group', Moobile.BarButtonGroup);
	this.addChild(instance);
});
