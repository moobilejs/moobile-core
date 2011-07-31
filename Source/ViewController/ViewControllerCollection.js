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

		if (viewController.isViewLoaded() == false) {
			viewController.addEvent('loaded', function() {
				this.addViewController(viewController, where, context);
			}.bind(this));
			return this;
		}

		this.viewControllers.push(viewController);

		this.willAddViewController(viewController);
		this.view.addChildView(viewController.view, where, context);
		viewController.viewControllerStack = this.viewControllerStack;
		viewController.viewControllerPanel = this.viewControllerPanel;
		viewController.parentViewController = this;
		this.didAddViewController(viewController);

		viewController.startup();

		Object.defineMember(this, viewController, viewController.name);

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
		var removed = this.viewControllers.erase(viewController);
		if (removed) {
			this.willRemoveViewController(viewController);
			viewController.view.removeFromParentView();
			this.didRemoveViewController(viewController);
		}
		return this;
	},

	attachViewControllers: function() {
		var filter = this.bound('filterViewController');
		var attach = this.bound('attachViewController');
		this.view.getElements('[data-role=view-controller]').filter(filter).each(attach);
		return this;
	},

	attachViewController: function(element) {
		var viewControllerClass = element.get('data-view-controller');
		if (viewControllerClass) {

			var viewElement = element.getElement('[data-role=view]');
			if (viewElement == null) {
				throw new Error('You must define a view element under view-controller element');
			}

			var viewController = Class.instanciate(viewControllerClass, viewElement);
			viewController.name = element.get('data-name');
			this.addViewController(viewController);

			element.grab(viewElement, 'before').destroy();
		}
		return this;
	},

	filterViewController: function(element) {
		return element.getParent('[data-role=view-controller]') == this.view.element;
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

	willRemoveViewController: function(viewController) {
		return this;
	},

	didRemoveViewController: function(viewController) {
		return this;
	}

});