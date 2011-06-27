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

	destroy: function() {
		this.destroyViewControllers();
		this.parent();
		return this;
	},

	addViewController: function(viewController, where, context) {
		this.willAddViewController(viewController);
		this.view.addChildView(viewController.view, where, context);
		this.bindViewController(viewController);
		this.didAddViewController(viewController);
		return this;
	},

	getViewController: function(name) {
		return this.viewControllers.find(function(viewController) {
			return viewController.view.getProperty('data-view-controller-name') == name;
		});
	},

	getViewControllers: function() {
		return this.viewControllers;
	},

	removeViewController: function(viewController) {
		var removed = this.viewControllers.remove(viewController);
		if (removed) {
			this.willRemoveViewController(viewController);
			viewController.view.removeFromParentView();
			this.didRemoveViewController(viewController);
		}
		return this;
	},

	attachViewControllers: function() {
		this.view.getChildViews().each(this.bound('attachViewController'));
		return this;
	},

	bindViewController: function(viewController) {
		Object.assertInstanceOf(viewController, Moobile.ViewController, 'ViewControllers must inherit Moobile.ViewController');
		this.viewControllers.push(viewController);
		viewController.parentViewController = this;
		viewController.viewControllerStack = this.viewControllerStack;
		viewController.viewControllerPanel = this.viewControllerPanel;
		viewController.startup();
		this.didBindViewController(viewController);
		Object.member(this, viewController, viewController.view.getProperty('data-view-controller-name'));
		return this;
	},

	attachViewController: function(view) {
		var viewController = view.getProperty('data-view-controller');
		if (viewController) {
			viewController = Class.from(viewController, view);
			this.bindViewController(viewController);
		}
		return this;
	},

	destroyViewControllers: function() {
		this.viewControllers.each(this.bound('destroyViewController'));
		this.viewControllers = [];
		return this;
	},

	destroyViewController: function(viewController) {
		viewController.destroy();
		viewController = null;
		return this;
	},

	willAddViewController: function(viewController) {
		return this;
	},

	didAddViewController: function(viewController) {
		return this;
	},

	didBindViewController: function(viewController) {
		return this;
	},

	willRemoveViewController: function(viewController) {
		return this;
	},

	didRemoveViewController: function(viewController) {
		return this;
	}

});