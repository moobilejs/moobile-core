/*
---

name: ViewControllerStack

description: Manages a view stack.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- ViewControllerStack

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewControllerStack = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_animating: false,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	loadView: function() {
		this.view = new Moobile.ViewStack();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#pushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	pushViewController: function(viewController, viewTransition) {

		if (this._animating)
			return this;

		if (this.getTopViewController() === viewController)
			return this;

		var childViewControllers = this.getChildViewControllers();

		viewController.removeFromParentViewController();
		viewController.setViewControllerStack(this);
		this.willPushViewController(viewController);
		this.addChildViewController(viewController);

		var viewControllerPushed = viewController;
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);

		var viewToShow = viewControllerPushed.getView();
		var viewToHide = viewControllerBefore
					   ? viewControllerBefore.getView()
					   : null;

		this._animating = true; // needs to be set before the transition happens

		viewTransition = viewTransition || new Moobile.ViewTransition.None();
		viewTransition.addEvent('start:once', this.bound('onPushTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPushTransitionComplete'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			this.view,
			childViewControllers.length === 1
		);

		viewControllerPushed.setViewTransition(viewTransition);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	onPushTransitionStart: function(e) {

		var childViewControllers = this.getChildViewControllers();
		var viewControllerPushed = childViewControllers.getLastItemAtOffset(0);
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewWillLeave();
		}

		viewControllerPushed.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	onPushTransitionComplete: function(e) {

		var childViewControllers = this.getChildViewControllers();
		var viewControllerPushed = childViewControllers.getLastItemAtOffset(0);
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewDidLeave();
		}

		this.didPushViewController(viewControllerPushed);

		viewControllerPushed.viewDidEnter();

		this._animating = false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#popViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	popViewController: function() {

		if (this._animating)
			return this;

		var childViewControllers = this.getChildViewControllers();
		if (childViewControllers.length <= 1)
			return this;

		var viewControllerPopped = childViewControllers.getLastItemAtOffset(0);
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);

		this.willPopViewController(viewControllerPopped);

		this._animating = true; // needs to be set before the transition happens

		var viewTransition = viewControllerPopped.getViewTransition();
		viewTransition.addEvent('start:once', this.bound('onPopTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPopTransitionComplete'));
		viewTransition.leave(
			viewControllerBefore.getView(),
			viewControllerPopped.getView(),
			this.view
		);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#popViewControllerUntil
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	popViewControllerUntil: function(viewController) {

		if (this._animating)
			return this;

		var childViewControllers = this.getChildViewControllers();
		if (childViewControllers.length <= 1)
			return this;

		var viewControllerIndex = this.getChildViewControllerIndex(viewController);
		if (viewControllerIndex > -1) {
			for (var i = childViewControllers.length - 2; i > viewControllerIndex; i--) {
				var viewControllerToRemove = this.getChildViewControllerAt(i);
				viewControllerToRemove.viewWillLeave();
				viewControllerToRemove.viewDidLeave();
				viewControllerToRemove.removeFromParentViewController();
				viewControllerToRemove.destroy();
				viewControllerToRemove = null;
			}
		}

		this.popViewController();

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	onPopTransitionStart: function(e) {
		var childViewControllers = this.getChildViewControllers();
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
		var viewControllerPopped = childViewControllers.getLastItemAtOffset(0);
		viewControllerBefore.viewWillEnter();
		viewControllerPopped.viewWillLeave();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	onPopTransitionComplete: function(e) {

		var childViewControllers = this.getChildViewControllers();
		var viewControllerPopped = childViewControllers.getLastItemAtOffset(0);
		var viewControllerBefore = childViewControllers.getLastItemAtOffset(1);
		viewControllerBefore.viewDidEnter();
		viewControllerPopped.viewDidLeave();
		viewControllerPopped.removeFromParentViewController();

		this.didPopViewController(viewControllerPopped);

		viewControllerPopped.destroy();
		viewControllerPopped = null;

		this._animating = false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#getTopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTopViewController: function() {
		return this.getChildViewControllers().getLast();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(null);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#willPushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willPushViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#didPushViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didPushViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#willPopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willPopViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#didPopViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didPopViewController: function(viewController) {

	}

});

Class.refactor(Moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_viewControllerStack: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#setViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setViewControllerStack: function(viewControllerStack) {

		if (this._viewControllerStack === viewControllerStack)
			return this;

		this.parentViewControllerStackWillChange(viewControllerStack);
		this._viewControllerStack = viewControllerStack;
		this.parentViewControllerStackDidChange(viewControllerStack);

		if (this instanceof Moobile.ViewControllerStack)
			return this;

		var by = function(component) {
			return !(component instanceof Moobile.ViewControllerStack);
		};

		this.getChildViewControllers().filter(by).invoke('setViewControllerStack', viewControllerStack);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#getViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewControllerStack: function() {
		return this._viewControllerStack;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#parentViewControllerStackWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerStackWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerStack#parentViewControllerStackDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerStackDidChange: function(viewController) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerStack(this._viewControllerStack);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerStack(null);
	}

});
