/*
---

name: ViewStack

description: Provide the view that will contains the view controller stack
             child views. This view must have a wrapper that will be double
             size of the original view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- View

provides:
	- ViewStack

...
*/

Moobile.ViewStack = new Class({

	/**
	 * This view does not have much code right now as it serves as an extension
	 * point for future features I may not have thought of yet.
	 */

	Extends: Moobile.View,

	options: {
		className: 'view-stack',
		withWrapperElement: false,
		withContentElement: true
	}

});