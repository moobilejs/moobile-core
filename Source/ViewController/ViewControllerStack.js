/*
---

name: ViewControllerStack

description: Provides a way to navigate from view to view and comming back.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Request.ViewController
	- ViewControllerCollection

provides:
	- ViewControllerStack

...
*/

Moobile.ViewControllerStack = new Class({

	Extends: Moobile.ViewControllerCollection,

	viewControllerRequest: null,

	loadView: function(element) {
		this.view = new Moobile.ViewStack(element);
		return this;
	},

	pushViewController: function(viewController, viewTransition) {

		this.window.disableInput();

		if (viewController.isViewLoaded() == false) {
			viewController.addEvent('loaded', function() {
				this.pushViewController(viewController, viewTransition);
			}.bind(this));
			return this;
		}

		var viewControllerPushed = viewController; // ease of understanding

		var viewControllerExists = this.viewControllers.contains(viewControllerPushed);
		if (viewControllerExists == false) {
			viewControllerPushed.viewControllerStack = this;
			viewControllerPushed.viewControllerPanel = this.viewControllerPanel;
		} else {
			this.viewControllers.erase(viewControllerPushed);
		}

		this.willPushViewController(viewControllerPushed);

		this.addViewController(viewControllerPushed);
		viewControllerPushed.view.show();
		viewControllerPushed.viewWillEnter();

		var viewControllerBefore = this.viewControllers.lastItemAt(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewWillLeave();
		}

		var viewToShow = viewControllerPushed.view;
		var viewToHide = viewControllerBefore ? viewControllerBefore.view : null;

		viewTransition = viewTransition || new Moobile.ViewTransition.Slide();
		viewTransition.addEvent('complete:once', this.bound('onPushTransitionCompleted'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			this.view,
			this.viewControllers.length == 1
		);

		viewControllerPushed.viewTransition = viewTransition;

		return this;
	},

	onPushTransitionCompleted: function() {

		var viewControllerPushed = this.viewControllers.lastItemAt(0);
		var viewControllerBefore = this.viewControllers.lastItemAt(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewDidLeave();
			viewControllerBefore.view.hide();
		}

		this.didPushViewController(viewControllerPushed);

		viewControllerPushed.viewDidEnter();

		this.window.enableInput();

		return this;
	},

	popViewControllerUntil: function(viewController) {

		if (this.viewControllers.length <= 1)
			return this;

		var viewControllerIndex = this.viewControllers.indexOf(viewController);
		if (viewControllerIndex > -1) {
			for (var i = this.viewControllers.length - 2; i > viewControllerIndex; i--) {

				var viewControllerToRemove = this.viewControllers[i];
				viewControllerToRemove.viewWillLeave();
				viewControllerToRemove.viewDidLeave();
				this.removeViewController(viewControllerToRemove);

				viewControllerToRemove.destroy();
				viewControllerToRemove = null;
			}
		}

		this.popViewController();

		return this;
	},

	popViewController: function() {

		if (this.viewControllers.length <= 1)
			return this;

		this.window.disableInput();

		var viewControllerPopped = this.viewControllers.lastItemAt(0);
		var viewControllerBefore = this.viewControllers.lastItemAt(1);

		this.willPopViewController(viewControllerPopped);

		viewControllerPopped.viewWillLeave();
		viewControllerBefore.viewWillEnter();
		viewControllerBefore.view.show();

		var viewTransition = viewControllerPopped.viewTransition;
		viewTransition.addEvent('complete:once', this.bound('onPopTransitionCompleted'));
		viewTransition.leave(
			viewControllerBefore.view,
			viewControllerPopped.view,
			this.view
		);

		return this;
	},

	onPopTransitionCompleted: function() {

		var viewControllerPopped = this.viewControllers.lastItemAt(0);
		var viewControllerBefore = this.viewControllers.lastItemAt(1);
		viewControllerBefore.viewDidEnter();
		viewControllerPopped.viewDidLeave();

		this.removeViewController(viewControllerPopped);

		this.didPopViewController(viewControllerPopped);

		viewControllerPopped.destroy();
		viewControllerPopped = null;

		this.window.enableInput();

		return this;
	},

	didAddViewController: function(viewController) {
		viewController.viewControllerStack = this;
		this.parent();
		return this;
	},

	willPushViewController: function(viewController) {
		return this;
	},

	didPushViewController: function(viewController) {
		return this;
	},

	willPopViewController: function(viewController) {
		return this;
	},

	didPopViewController: function(viewController) {
		return this;
	}
});