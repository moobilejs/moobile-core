/*
---

name: ViewControllerPanel.Split

description: Provide a way to have side by side view controllers.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- ViewControllerPanel

provides:
	- ViewControllerPanel.Split

...
*/

Moobile.ViewControllerPanel.Split = new Class({

	Extends: Moobile.ViewControllerPanel,

	mainViewController: null,

	sideViewController: null,

	options: {
		mainViewControllerClassName: 'view-panel-main-pane',
		sideViewControllerClassName: 'view-panel-side-pane'
	},

	initialize: function(sideViewController, mainViewController, view) {
		this.parent(view);
		this.sideViewController = sideViewController;
		this.mainViewController = mainViewController;
		return this;
	},

	startup: function() {
		this.parent();
		this.setViewController(this.options.sideViewControllerClassName, this.sideViewController);
		this.setViewController(this.options.mainViewControllerClassName, this.mainViewController);
		return this;
	},

	getMainViewController: function() {
		return this.mainViewController;
	},

	getSideViewController: function() {
		return this.sideViewController;
	}

});