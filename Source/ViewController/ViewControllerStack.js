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
 * @name  VewControllerStack
 * @class Provides a controller that manages a view stack.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Options]
 *
 * @extends ViewController
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewControllerStack = new Class( /** @lends ViewControllerStack.prototype */ {

	Extends: Moobile.ViewController,

	/**
	 * @var    {ViewController} The top view controller.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	topViewController: null,

	loadView: function() {
		this.view = new Moobile.ViewStack();
	},

	/**
	 * Pushes a view controller into the stack.
	 *
	 * This method will add a new view controller at the end of the stack and
	 * present it using a given view transition. The given transition will be
	 * stored into the view controller so the same will be used when the
	 * view controller will be popped.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @param {viewTransition} viewTransition The view transition.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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
	 * Pops the top view controller.
	 *
	 * This method will pop the top view controller using the same view
	 * transition that was used to push it and destroys the popped view
	 * controller once the transition finishes.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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
	 * Pops view controllers until a given view controller is reached.
	 *
	 * This method will pop view controllers until the given view controller is
	 * reached and destroy popped view controllers when the transition
	 * finishes.
	 *
	 * @param {ViewController} viewController The view controller to pop to.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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
	 * Returns the top view controller.
	 *
	 * @return {ViewController} The top view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTopViewController: function() {
		return this.topViewController;
	},

	willAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(this);
	},

	/**
	 * Tells this view controller it's about to push a view controller.
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
	 * Tells the view controller it pushed a view controller.
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
	 * Tells the view controller it's about to pop a view controller.
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
	 * Tells the view controller it popped a view controller.
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

	onPushTransitionStart: function() {

		var viewControllerPushed = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewWillLeave();
		}

		viewControllerPushed.viewWillEnter();
	},

	onPushTransitionComplete: function() {

		var viewControllerPushed = this.childViewControllers.lastItemAt(0);
		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewDidLeave();
		}

		this.didPushViewController(viewControllerPushed);

		viewControllerPushed.viewDidEnter();
	},

	onPopTransitionStart: function() {

		var viewControllerBefore = this.childViewControllers.lastItemAt(1);
		var viewControllerPopped = this.childViewControllers.lastItemAt(0);

		viewControllerBefore.viewWillEnter();
		viewControllerPopped.viewWillLeave();
	},

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
