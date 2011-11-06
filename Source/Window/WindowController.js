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
	
	setRootViewController: function(rootViewController) {

		if (this.rootViewController) {
			this.rootViewController.removeFromParentViewController();
			this.rootViewController.destroy();
			this.rootViewController = null;
		}

		if (rootViewController) {
			this.rootViewController = rootViewController;
			this.addChildController(rootViewController);
		}

		return this;
	},
	
	getRootViewController: function() {
		return this.rootViewController;
	},

	loadView: function(viewElement) {
		this.view = new Moobile.Window(viewElement);
		this.startup();
		return this;
	},
	
	willAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setWindowController(this);
	},

	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		this.rootViewController = viewController;
		return this;
	}

});