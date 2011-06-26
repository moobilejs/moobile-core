/*
---

name: ViewControllerCollection

description: This is the base class for controllers that contains child view
             controllers.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- ViewControllerCollection

...
*/

Moobile.ViewControllerCollection = new Class({

	Extends: Moobile.ViewController,

	viewControllers: [],

	getViewControllers: function() {
		return this.viewControllers;
	}


});