/*
---

name: NavigationBar

description: Provides a bar control used to navigate between views.

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

/**
 * Provides a bar control used to navigate between views.
 *
 * @name NavigationBar
 * @class NavigationBar
 * @extends Bar
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.NavigationBar = new Class( /* @lends NavigationBar.prototype */ {

	Extends: Moobile.Bar,

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {
		this.parent();
		this.element.addClass('navigation-bar');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('navigation-bar', null, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-navigation-bar', Moobile.NavigationBar);
	this.addChild(instance);
});

