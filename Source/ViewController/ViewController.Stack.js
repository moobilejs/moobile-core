/*
---

name: ViewController.Stack

description: Provides a way to navigate from view to view and comming back.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- Request.ViewController
	- ViewController

provides:
	- ViewController.Stack

...
*/

Moobile.ViewController.Stack = new Class({

	Extends: Moobile.ViewController,

	topViewController: null,

	viewControllers: [],
	
	viewControllerRequest: null,

	initialize: function(view) {
		this.parent(view);
		this.viewControllerRequest = new Moobile.Request.ViewController(this);
		this.view.hide();
		return this;
	},

	loadView: function(view) {
		this.view = view || new Moobile.View.Stack(new Element('div'));
	},

	startup: function() {
		return this.parent();
	},

	shutdown: function() {
		return this.parent();
	},

	attachEvents: function() {
		return this.parent();
	},

	detachEvents: function() {
		return this.parent();
	},

	pushViewControllerFrom: function(remote) {
		this.viewControllerRequest.cancel();
		this.viewControllerRequest.getViewController(remote);
		return this;
	},

	pushViewController: function(viewController, viewControllerTransition) {
		viewController.setViewControllerStack(this);
		viewController.setViewControllerPanel(this.viewControllerPanel);
		this.viewControllers.push(viewController);

		if (this.viewControllers.length == 1) {
			this.view.addChildView(viewController.view);
			this.view.fade('hide');
			this.view.show();
			viewController.doStartup();
			viewController.viewWillEnter();
			viewController.viewDidEnter();
			new Fx.CSS3.Tween(this.view).start('opacity', 0, 1);
		} else {

			var transition = viewControllerTransition || viewController.getTransition();
			if (transition && typeOf(transition) == 'class') {
				transition = Class.instanciate(transition);
			}

			viewController.setTransition(transition);

			this.view.addChildView(viewController.view);
			viewController.doStartup();
			viewController.viewWillEnter();

			this.viewControllers.getLast(1).viewWillLeave();

			if (transition) {
				transition.startup(viewController);
				transition.chain(this.bound('onPushTransitionCompleted'));
				transition.prepare('enter');
				transition.execute('enter');
			} else {
				this.onPushTransitionCompleted();
			}
		}

		this.topViewController = viewController;

		return this;
	},

	onPushTransitionCompleted: function() {
		this.viewControllers.getLast()
			.viewDidEnter();
		this.viewControllers.getLast(1)
			.viewDidLeave();
		return this;
	},

	popViewController: function() {
		if (this.viewControllers.length) {
			this.viewControllers.getLast(1).viewWillEnter();
			this.viewControllers.getLast(0).viewWillLeave();
			var transition = this.viewControllers.getLast().getTransition();
			if (transition) {
				transition.chain(this.bound('onPopTransitionCompleted'));
				transition.prepare('leave');
				transition.execute('leave');
			} else {
				this.onPopTransitionCompleted();
			}
			this.topViewController = this.viewControllers.getLast(1);
		}
		return this;
	},

	onPopTransitionCompleted: function() {
		this.viewControllers.getLast(1)
			.viewDidEnter();
		this.viewControllers.getLast()
			.viewDidLeave();
		this.viewControllers.pop()
			.viewDidRemove();
		return this;
	},

	getViewControllers: function() {
		return this.viewControllers;
	},

	getViewControllerAt: function(offset) {
		return this.viewControllers.getLast(offset);
	},

	viewWillEnter: function() {
		return this;
	},

	viewDidEnter: function() {
		return this;
	},

	viewWillLeave: function() {
		return this;
	},

	viewDidLeave: function() {
		return this;
	}

});