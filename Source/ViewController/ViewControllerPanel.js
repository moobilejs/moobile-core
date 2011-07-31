/*
---

name: ViewControllerPanel

description: Provide a way to have side by side view controllers.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewControllerCollection

provides:
	- ViewControllerPanel

...
*/

Moobile.ViewControllerPanel = new Class({

	Extends: Moobile.ViewControllerCollection,

	didAddViewController: function(viewController) {
		viewController.viewControllerPanel = this;
		this.parent();
		return this;
	}
});