/*
---

name: ViewControllerStack

description: Provides a way to navigate from view to view and comming back.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- Request.ViewController
	- ViewController

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

	loadViewControllerFrom: function(url, callback) {

		if (this.viewControllerRequest == null) {
			this.viewControllerRequest = new Moobile.Request.ViewController();
		}

		this.viewControllerRequest.cancel();
		this.viewControllerRequest.load(url, callback);

		return this;
	},

	pushViewControllerFrom: function(url, viewTransition) {
		this.loadViewControllerFrom(url,
			function(viewController) {
				this.pushViewController(viewController, viewTransition);
			}.bind(this)
		);
		return this;
	},

	pushViewController: function(viewController, viewTransition) {

		this.window.disableUserInput();

		var viewControllerPushed = viewController; // ease of understanding

		var viewControllerIndex = this.viewControllers.indexOf(viewControllerPushed);
		if (viewControllerIndex == -1) {
			viewControllerPushed.viewControllerStack = this;
			viewControllerPushed.viewControllerPanel = this.viewControllerPanel;
		} else {
			this.viewControllers.remove(viewControllerPushed);
		}

		this.willPushViewController(viewControllerPushed);

		this.addViewController(viewControllerPushed);
		viewControllerPushed.view.show();
		viewControllerPushed.viewWillEnter();

		var viewControllerBefore = this.viewControllers.getLast(1);
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

		var viewControllerPushed = this.viewControllers.getLast(0);
		var viewControllerBefore = this.viewControllers.getLast(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewDidLeave();
			viewControllerBefore.view.hide();
		}

		viewControllerPushed.viewDidEnter();

		this.didPushViewController(viewControllerPushed);

		this.window.enableUserInput();

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
				viewControllerToRemove.view.destroy();
				viewControllerToRemove.view = null;
				viewControllerToRemove.destroy();

			}
		}

		this.popViewController();

		return this;
	},

	popViewController: function() {

		if (this.viewControllers.length <= 1)
			return this;

		this.window.disableUserInput();

		var viewControllerPopped = this.viewControllers.getLast(0);
		var viewControllerBefore = this.viewControllers.getLast(1);

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

		var viewControllerPopped = this.viewControllers.getLast(0);
		var viewControllerBefore = this.viewControllers.getLast(1);
		viewControllerBefore.viewDidEnter();
		viewControllerPopped.viewDidLeave();

		this.removeViewController(viewControllerPopped);
		viewControllerPopped.view.destroy();
		viewControllerPopped.view = null;
		viewControllerPopped.destroy();

		this.didPopViewController(viewControllerPopped);

		this.window.enableUserInput();

		return this;
	},

	didBindViewController: function(viewController) {
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