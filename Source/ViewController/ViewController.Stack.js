/*
---

name: ViewController.Stack

description: Provides a way to navigate from view to view and comming back.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- History.ViewController
	- Request.ViewController
	- ViewController

provides:
	- ViewController.Stack

...
*/

Moobile.ViewController.Stack = new Class({

	Extends: Moobile.ViewController,

	Binds: [
		'pushTransitionCompleted',
		'popTransitionCompleted',
		'onHistoryForward',
		'onHistoryBack'
	],

	viewControllers: [],

	history: null,

	request: null,

	initialize: function(view) {
		this.parent(view);
		this.history = new Moobile.History.ViewController();
		this.request = new Moobile.Request.ViewController(this);
		this.view.hide();
		return this;
	},

	loadView: function(view) {
		this.view = view || new Moobile.View.Navigation(new Element('div'));
	},

	startup: function() {
		return this.parent();
	},

	shutdown: function() {
		return this.parent();
	},

	attachEvents: function() {
		this.history.addEvent('forward', this.onHistoryForward);
		this.history.addEvent('back', this.onHistoryBack);
		return this.parent();
	},

	detachEvents: function() {
		this.history.removeEvent('forward', this.onHistoryForward);
		this.history.removeEvent('back', this.onHistoryBack);
		return this.parent();
	},

	pushViewControllerFrom: function(remote) {
		this.request.cancel();
		this.request.getViewController(remote);
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
				transition.chain(this.pushTransitionCompleted);
				transition.prepare('enter');
				transition.execute('enter');
			} else {
				this.pushTransitionCompleted();
			}
		}

		this.history.push(viewController);

		return this;
	},

	pushTransitionCompleted: function() {
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
				transition.chain(this.popTransitionCompleted)
				transition.prepare('leave');
				transition.execute('leave');
			} else {
				this.popTransitionCompleted();
			}
		}
		return this;
	},

	popTransitionCompleted: function() {
		this.viewControllers.getLast(1)
			.viewDidEnter();
		this.viewControllers.getLast()
			.viewDidLeave();
		this.viewControllers.pop()
			.viewDidRemove();

		this.history.pop();

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
	},

	/* still buggy */

	onHistoryBack: function(viewController) {
		this.popViewController();
		return this;
	},

	onHistoryForward: function(viewController) {
		this.pushViewController(viewController);
		return this;
	}

});