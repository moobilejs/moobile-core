/*
---

name: NavigationView

description: Provide a view for the navigation view controller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewStack

provides:
	- NavigationView

...
*/

Moobile.ViewStack.Navigation = new Class({

	/**
	 * This view does not have much code right now as it serves as an extension
	 * point for future features I may not have thought of yet.
	 */

	Extends: Moobile.ViewStack,

	options: {
		className: 'navigation-view-stack'
	}

});