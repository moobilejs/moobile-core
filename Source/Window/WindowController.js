/*
---

name: WindowController

description: Provides the starting poing view controller inside the window.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewControllerCollection

provides:
	- WindowController

...
*/

Moobile.WindowController = new Class({

	Extends: Moobile.ViewControllerCollection,

	rootViewController: null,

	initialize: function(viewElement) {
		this.loadView(viewElement);
		this.startup();
		return this;
	},

	startup: function() {
		this.parent();
		this.window = this.view;
		this.window.startup();
		return this;
	},

	loadView: function(viewElement) {
		this.view = new Moobile.Window(viewElement);
		return this;
	},

	filterViewController: function(element) {
		return element.getParent('[data-role=view-controller]') == null;
	},

	setRootViewController: function(rootViewController) {

		if (this.rootViewController) {
			this.viewController.removeViewController(this.rootViewController);
			this.rootViewController.view.destroy();
			this.rootViewController.view = null;
			this.rootViewController.destroy();
			this.rootViewController = null;
		}

		this.viewController.addViewController(rootViewController);

		this.rootViewController = rootViewController;

		return this;
	},

	getRootViewController: function() {
		return this.rootViewController;
	},

	didAddViewController: function(viewController) {
		this.rootViewController = viewController;
		this.parent(viewController);
		return this;
	}

});