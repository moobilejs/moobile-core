/*
---

name: WindowController

description: Provides the ViewController that handles a window.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- WindowController

...
*/

Moobile.WindowController = new Class({

	Extends: Moobile.ViewController,

	rootViewController: null,

	initialize: function(viewElement, options) {
		this.parent(viewElement, options);
		this.window = this.view;
		this.window.startup();
		this.startup();
		return this;
	},

	setRootViewController: function(rootViewController) {

		if (this.rootViewController) {
			this.rootViewController.removeFromParentViewController();
			this.rootViewController.destroy();
			this.rootViewController = null;
		}

		if (rootViewController) {
			this.rootViewController = rootViewController;
			this.addChildViewController(rootViewController);
		}

		return this;
	},

	filterChildViewController: function(element) {
		return element.getParent('[data-role=view-controller]') == null;
	},

	loadView: function(viewElement) {
		this.view = Class.instanciate(
			viewElement.get('data-view') || 'Moobile.Window',
			viewElement
		);
		return this;
	},

	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		this.rootViewController = viewController;
		return this;
	}

});