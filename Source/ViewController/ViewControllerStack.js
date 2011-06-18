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

	Extends: Moobile.ViewController,

	viewControllers: [],

	viewControllerRequest: null,

	topViewController: null,

	initialize: function(view) {
		this.parent(view);
		this.viewControllerRequest = new Moobile.Request.ViewController(this);
		return this;
	},

	loadView: function(view) {
		this.view = view || new Moobile.ViewStack(new Element('div'));
		return this;
	},

	pushViewControllerFrom: function(viewControllerRemote, viewControllerTransition) {
		this.viewControllerRequest.cancel();
		this.viewControllerRequest.loadViewController(
			viewControllerRemote,
			function(viewController) {
				this.pushViewController(viewController, viewControllerTransition);
			}.bind(this)
		);
		return this;
	},

	pushViewController: function(viewController, viewControllerTransition) {

		this.window.disableUserInput();

		var viewControllerIndex = this.viewControllers.indexOf(viewController);
		if (viewControllerIndex == -1) {
			viewController.viewControllerStack = this;
			viewController.viewControllerPanel = this.viewControllerPanel;
		} else {
			this.viewControllers.remove(viewController);
		}

		this.viewControllers.push(viewController);

		this.view.addChildView(viewController.view);
		viewController.activate();
		viewController.viewWillEnter();

		var viewControllerBefore = this.viewControllers.getLast(1);
		if (viewControllerBefore) {
			viewControllerBefore.viewWillLeave();
		}

		var viewToShow = viewController.view;
		var viewToHide = viewControllerBefore ? viewControllerBefore.view : null;

		viewControllerTransition = viewControllerTransition || new Moobile.ViewControllerTransition.Slide();
		viewControllerTransition.addEvent('complete:once', this.bound('onPushTransitionCompleted'));
		viewControllerTransition.enter(
			viewToShow,
			viewToHide,
			this.view,
			this.view.getContent(),
			this.viewControllers.length == 1
		);

		viewController.viewControllerTransition = viewControllerTransition;

		this.topViewController = viewController;

		return this;
	},

	onPushTransitionCompleted: function() {
		this.viewControllers.getLast(0)
			.viewDidEnter();
		if (this.viewControllers.length > 1) {
			this.viewControllers.getLast(1)
				.viewDidLeave();
		}

		this.window.enableUserInput();

		return this;
	},

	popViewController: function() {

		if (this.viewControllers.length <= 1)
			return this;

		this.window.disableUserInput();

		var viewController = this.viewControllers.getLast();
		var viewControllerBefore = this.viewControllers.getLast(1);
		viewController.viewWillLeave();
		viewControllerBefore.viewWillEnter();

		var viewControllerTransition = this.topViewController.viewControllerTransition;
		viewControllerTransition.addEvent('complete:once', this.bound('onPopTransitionCompleted'));
		viewControllerTransition.leave(
			viewControllerBefore.view,
			viewController.view,
			this.view,
			this.view.getContent()
		);

		this.topViewController = this.viewControllers.getLast(1);

		return this;
	},

	popViewControllerUntil: function(viewController) {

		if (this.viewControllers.length <= 1)
			return this;

		var index = this.viewControllers.indexOf(viewController);
		if (index > -1) {
			for (var i = this.viewControllers.length - 2; i > index; i--) {
				var removedViewController = this.viewControllers[i];
				removedViewController.viewWillLeave();
				removedViewController.viewDidLeave();
				removedViewController.viewDidRemove();
				removedViewController.deactivate();
				this.viewControllers.splice(i, 1);
			}
		}

		this.popViewController();

		return this;
	},

	onPopTransitionCompleted: function() {
		this.viewControllers.getLast(1)
			.viewDidEnter();
		this.viewControllers.getLast(0)
			.viewDidLeave();
		this.viewControllers.pop()
			.viewDidRemove()
			.deactivate();

		this.window.enableUserInput();

		return this;
	},

	getViewControllers: function() {
		return this.viewControllers;
	},

	getTopViewController: function() {
		return this.topViewController;
	},

	getDefaultViewClass: function() {
		return 'Moobile.View';
	},

	getDefaultViewControllerClass: function() {
		return 'Moobile.ViewController';
	},

	getDefaultViewControllerTransitionClass: function() {
		return 'Moobile.ViewControllerTransition.Slide';
	},

	orientationDidChange: function(orientation) {
		this.viewControllers.each(function(viewController) { viewController.orientationDidChange(orientation) });
		return this.parent();
	}

});