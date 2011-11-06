/*
---

name: ViewControllerStack

description: Provides a ViewController that handles multiple views inside its
             own view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- ViewControllerStack

...
*/

Moobile.ViewControllerStack = new Class({

	Extends: Moobile.ViewController,

	topViewController: null,

	loadView: function(viewElement) {
		this.view = Class.instantiate(
			viewElement.get('data-class') || 'Moobile.ViewStack',
			viewElement
		);
	},

	getTopViewController: function() {
		return this.topViewController;
	},
	
	pushViewController: function(viewController, viewTransition) {

		if (this.topViewController == viewController)
			return;

		if (this.childViewControllers.length > 0)
			this.window.disableInput();

		if (viewController.isViewLoaded() == false) {
			viewController.addEvent('viewload:once', function() {
				this.pushViewController(viewController, viewTransition);
			}.bind(this));
			return this;
		}

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

		this.window.enableInput();

		viewControllerPushed.viewDidEnter();
	},

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

	popViewController: function() {

		if (this.childViewControllers.length <= 1)
			return this;

		this.window.disableInput();

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

		this.window.enableInput();
	},

	willAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerStack(this);
	},

	willPushViewController: function(viewController) {

	},

	didPushViewController: function(viewController) {

	},

	willPopViewController: function(viewController) {

	},

	didPopViewController: function(viewController) {

	}

});
