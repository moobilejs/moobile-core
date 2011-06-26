/*
---

name: ViewPanel

description: Provide the view that will contains the different panels.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- View

provides:
	- ViewPanel

...
*/

Moobile.ViewPanel = new Class({

	/**
	 * This view does not have much code right now as it serves as an extension
	 * point for future features I may not have thought of yet.
	 */

	Extends: Moobile.View,

	options: {
		className: 'view-panel',
		withWrapper: false,
		withContent: false
	}

});