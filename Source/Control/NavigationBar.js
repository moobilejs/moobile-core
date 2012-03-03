/*
---

name: NavigationBar

description: Provides a bar control used to navigate between views.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar

provides:
	- NavigationBar

...
*/

/**
 * @see    http://moobile.net/api/0.1/Control/NavigationBar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.NavigationBar = new Class({

	Extends: Moobile.Bar,

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('navigation-bar');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('navigation-bar', null, function(element) {
	this.addChild(Moobile.Component.create(Moobile.NavigationBar, element, 'data-navigation-bar'));
});

