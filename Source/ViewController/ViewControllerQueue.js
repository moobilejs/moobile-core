/*
---

name: ViewControllerQueue

description: Manage a limited or unlimited queue of view controllers.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewControllerStack

provides:
	- ViewControllerQueue

...
*/

Moobile.ViewControllerQueue = new Class({

	Extends: Moobile.ViewControllerStack,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3
	 */
	options: {
		length: Infinity
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3
	 */
	loadView: function() {
		this.view = new Moobile.ViewQueue();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3
	 */
	unshiftViewController: function(viewController) {
		this.addChildViewControllerAt(viewController, 0);
		this.popViewController();
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerQueue(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerQueue(null);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onPushTransitionComplete: function() {

		this.parent();

		var length = this.options.length;
		if (length === Infinity)
			return;

		var children = this.getChildViewControllers();
		if (children.length > length) {
			var diff = children.length - length;
			for (var i = 0; i < diff; i++) {
				children[i].removeFromParentViewController(true);
			}
		}
	},

});

Class.refactor(Moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	_viewControllerQueue: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/setViewControllerQueue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	setViewControllerQueue: function(viewControllerQueue) {

		if (this._viewControllerQueue === viewControllerQueue)
			return this;

		this.viewControllerQueueWillChange(viewControllerQueue);
		this._viewControllerQueue = viewControllerQueue;
		this.viewControllerQueueDidChange(viewControllerQueue);

		if (this instanceof Moobile.ViewControllerQueue)
			return this;

		var by = function(component) {
			return !(component instanceof Moobile.ViewControllerQueue);
		};

		this.getChildViewControllers().filter(by).invoke('setViewControllerQueue', viewControllerQueue);

		return this;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	getViewControllerQueue: function() {
		return this._viewControllerQueue;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	viewControllerQueueWillChange: function(viewController) {

	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	viewControllerQueueDidChange: function(viewController) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerQueue(this._viewControllerQueue);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerQueue(null);
	}

});
