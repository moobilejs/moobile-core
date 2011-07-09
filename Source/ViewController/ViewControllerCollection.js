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

	init: function() {
		this.parent();
		this.attachViewControllers();
		return this;
	},

	release: function() {
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

	getLength: function() {
		return this.viewControllers.length;
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
		this.viewControllers.push(viewController);
		viewController.viewControllerStack = this.viewControllerStack;
		viewController.viewControllerPanel = this.viewControllerPanel;
		viewController.parentViewController = this;
		this.didBindViewController(viewController);
		viewController.startup();
		Object.defineMember(this, viewController, viewController.view.getProperty('data-view-controller-name'));
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