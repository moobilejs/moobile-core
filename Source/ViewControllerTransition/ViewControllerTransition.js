/*
---

name: ViewControllerTransition

description: Provides the base class for view controller transition effects.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- ViewControllerTransition

...
*/

Moobile.ViewControllerTransition = new Class({

	Implements: [Chain],

	Binds: ['onTransitionComplete'],

	viewController: null,

	viewControllerStack: null,

	running: false,

	startup: function(viewController) {
		this.viewController = viewController;
		this.viewControllerStack = viewController.getViewControllerStack();
		this.attachEvents();
		return this;
	},

	attachEvents: function() {
		return this;
	},

	detachEvents: function() {
		return this;
	},

	prepare: function(direction) {
		return this.setup(direction);
	},

	execute: function(direction) {
		if (this.running == false) {
			this.running = true;
			this.attachEvents();
			this.start.delay(5, this, direction);
		}
		return this;
	},

	setup: function(direction) {
		return this;
	},

	start: function(direction) {
		return this.onTransitionComplete();
	},

	onTransitionComplete: function(e) {
		if (this.running == true) {
			this.running = false;
			this.detachEvents();
			this.callChain();
		}
		return this;
	}

});