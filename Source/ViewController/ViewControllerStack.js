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
 * Manages a view stack.
 *
 * @name ViewControllerStack
 * @class ViewControllerStack
 * @extends ViewController
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewControllerStack = new Class( /** @lends ViewControllerStack.prototype */ {

	Extends: Moobile.ViewController,

	/**
	 * The last pushed view controller.
	 * @type {ViewController}
	 */
	topViewController: null,

	/**
	 * Return the last pushed view controller.
	 * @return {ViewController}
	 * @since 0.1
	 */
	getTopViewController: function() {
		return this.topViewController;
	},

	/**
	 * Push a new view controller into the stack using a view transition.
	 * @param {ViewController} viewController The view controller to push.
	 * @param {viewTransition} viewTransition The view transition.
	 * @return {ViewController}
	 * @since 0.1
	 */
	pushViewController: function(viewController, viewTransition) {

		if (this.topViewController == viewController)
			return;

		var viewControllerPushed = viewController; // ease of understanding

		var viewControllerExists = this.childViewControllers.contains(viewControllerPushed);
		if (viewControllerExists) {
			this.removeChildViewController(viewControllerPushed);
		}

		this.willPushViewController(viewControllerPushed);

		this.addChildViewController(viewControllerPushed);

		this.topViewController = viewControllerPushed;

		var viewControllerBefore = this.childViewControllers.lastItemAt(1);

		var viewToShow = viewControllerPushed.view;
		var viewToHide = viewControllerBefore
					   ? viewControllerBefore.view
					   : null;

		viewTransition = viewTransition || new Moobile.ViewTransition.None();
		viewTransition.addEvent('start:once', this.bound('onPushTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPushTransitionComplete'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			this.view,
			this.childViewControllers.length == 1
		);

		viewControllerPushed.setViewTransition(viewTransition);

		return this;
	},

	/**
	 * Removes the top view controller using the same transition that was used
	 * to push it into the view controller stack.
	 * @return {ViewController}
	 * @since 0.1
	 */
	popViewController: function() {

		if (this.childViewControllers.length <= 1)
			return this;

		var viewControllerPopped = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);

		this.willPopViewController(viewControllerPopped);

		this.topViewController = viewControllerBefore;

		var viewTransition = viewControllerPopped.viewTransition;
		viewTransition.addEvent('start:once', this.bound('onPopTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPopTransitionComplete'));
		viewTransition.leave(
			viewControllerBefore.view,
			viewControllerPopped.view,
			this.view
		);

		return this;
	},

	/**
	 * Pop view controllers until a certain view controller is reached.
	 * @param {ViewController} viewController The view controller to stop.
	 * @return {ViewController}
	 * @since 0.1
	 */
	popViewControllerUntil: function(viewController) {

		if (this.childViewControllers.length <= 1)
			return this;

		var viewControllerIndex = this.childViewControllers.indexOf(viewController);
		if (viewControllerIndex > -1) {
			for (var i = this.childViewControllers.length - 2; i > viewControllerIndex; i--) {

				var viewControllerToRemove = this.childViewControllers[i];
				viewControllerToRemove.viewWillLeave();
				viewControllerToRemove.viewDidLeave();
				this.removeChildViewController(viewControllerToRemove);

				viewControllerToRemove.destroy();
				viewControllerToRemove = null;
			}
		}

		this.popViewController();

		return this;
	},

	/**
	 * @see ViewController#loadView
	 */
	loadView: function() {
		this.view = new Moobile.ViewStack();
	},

	/**
	 * @see ViewController#willAddChildViewController
	 */
	willAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(this);
	},

	/**
	 * Called by the view controller before a new view controller is pushed
	 * into the view controller stack.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @since 0.1
	 */
	willPushViewController: function(viewController) {

	},

	/**
	 * Called by the view controller after a view controller has been pushed
	 * into the view controller stack.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @since 0.1
	 */
	didPushViewController: function(viewController) {

	},

	/**
	 * Called by the view controller before a view controller is popped
	 * from the view controller stack.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @since 0.1
	 */
	willPopViewController: function(viewController) {

	},

	/**
	 * Called by the view controller after a view controller has been popped
	 * from the view controller stack.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @since 0.1
	 */
	didPopViewController: function(viewController) {

	},

	/**
	 * The push transition start event handler.
	 * @since 0.1
	 * @private
	 */
	onPushTransitionStart: function() {

		var viewControllerPushed = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewWillLeave();
		}

		viewControllerPushed.viewWillEnter();
	},

	/**
	 * The push transition complete event handler.
	 * @since 0.1
	 * @private
	 */
	onPushTransitionComplete: function() {

		var viewControllerPushed = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewDidLeave();
		}

		this.didPushViewController(viewControllerPushed);

		viewControllerPushed.viewDidEnter();
	},

	/**
	 * The pop transition start event handler.
	 * @since 0.1
	 * @private
	 */
	onPopTransitionStart: function() {

		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		var viewControllerPopped = this.childViewControllers.lastItemAt(0);

		viewControllerBefore.viewWillEnter();
		viewControllerPopped.viewWillLeave();
	},

	/**
	 * The push transition complete event handler.
	 * @since 0.1
	 * @private
	 */
	onPopTransitionComplete: function() {

		var viewControllerPopped = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		viewControllerBefore.viewDidEnter();
		viewControllerPopped.viewDidLeave();

		this.removeChildViewController(viewControllerPopped);

		this.didPopViewController(viewControllerPopped);

		viewControllerPopped.destroy();
		viewControllerPopped = null;
	}

});
