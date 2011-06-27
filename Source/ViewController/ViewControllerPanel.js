/*
---

name: ViewControllerPanel

description: Provide a way to have side by side view controllers.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- ViewControllerPanel

...
*/

Moobile.ViewControllerPanel = new Class({

	Extends: Moobile.ViewControllerCollection,

	loadView: function(view) {
		this.view = view || new Moobile.ViewPanel();
		Object.assertInstanceOf(this.view, Moobile.ViewPanel, 'Moobile.ViewControllerPanel view must be an intance of Moobile.ViewPanel');
		return this;
	},

	didBindViewController: function(viewController) {
		viewController.viewControllerPanel = this;
		this.parent();
		return this;
	}
});