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

	Extends: Moobile.ViewStack,

	options: {
		className: 'navigation-view-stack'
	}

});