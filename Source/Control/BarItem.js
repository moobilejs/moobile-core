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
 * @name  BarItem
 * @class Provides a bar item control.
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
 * @extends Control
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.BarItem = new Class( /** @lends BarItem.prototype */ {

	Extends: Moobile.Control,

	willBuild: function() {
		this.parent();
		this.element.addClass('bar-item');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('item', Moobile.Bar, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-item', Moobile.BarItem);
	this.setItem(item);
});
