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

	Extends: Moobile.ViewController,

	viewControllers: {},

	loadView: function(view) {
		this.view = view || new Moobile.ViewPanel(new Element('div'));
		return this;
	},

	setViewController: function(name, viewController) {
		this.viewControllers[name] = viewController;
		this.view.addChildView(viewController.view);
		viewController.viewControllerPanel = this;
		viewController.activate();
		viewController.viewWillEnter();
		viewController.viewDidEnter();
		viewController.view.addClass(name);
		return this;
	},

	getViewController: function(name) {
		return this.viewControllers[name] ? this.viewControllers[name] : null;
	}

});