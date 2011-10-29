/*
---

name: ViewControllerPanel

description: Provide a ViewController that handles two side by side view inside
             it's own view.

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

	Extends: Moobile.ViewController,

	mainViewController: null,

	sideViewController: null,

	loadView: function(viewElement) {
		this.view = Class.instanciate(
			viewElement.get('data-class') || 'Moobile.ViewPanel',
			viewElement
		);
		return this;
	},

	setMainViewController: function(mainViewController) {

		if (this.mainViewController) {
			this.mainViewController.removeFromParentViewController();
			this.mainViewController.destroy();
			this.mainViewController = null;
		}

		this.mainViewController = mainViewController;

		this.addChildController(this.mainViewController, 'top', this.view.getMainPanel());

		return this;
	},

	getMainViewController: function() {
		return this.mainViewController;
	},

	setSideViewController: function(sideViewController) {

		if (this.sideViewController) {
			this.sideViewController.destroy();
			this.sideViewController = null;
		}

		this.sideViewController = sideViewController;

		this.addChildController(this.sideViewController, 'top', this.view.getSidePanel());

		return this;
	},

	getSideViewController: function() {
		return this.sideViewController;
	},

	didAddChildViewController: function(viewController) {
		viewController.setViewControllerPanel(this);
		this.parent();
		return this;
	}

});