/*
---

name: NavigationBarItemTitle

description:Provides a title control used inside navigation bar item.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- NavigationBarItemTitle

...
*/

/**
 * Provides a title control used inside navigation bar item.
 *
 * @name NavigationBarItemTitle
 * @class NavigationBarItemTitle
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.NavigationBarItemTitle = new Class( /* @lends NavigationBarItemTitle.prototype */ {

	Extends: Moobile.Text,

	didLoad: function() {
		this.parent();
		this.element.addClass('bar-title');
	},

	destroy: function() {
		this.text = null;
		this.parent();
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('title', Moobile.NavigationBarItem, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-title', Moobile.NavigationBarItemTitle);
	this.setTitle(instance);
});
