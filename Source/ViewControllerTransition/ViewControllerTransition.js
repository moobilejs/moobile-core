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

	Implements: [Chain, Class.Binds],
	
	running: false,

	viewController: null,

	viewControllerStack: null,

	startup: function(viewController, viewControllerStack) {
		this.viewController = viewController;
		this.viewControllerStack = viewControllerStack;
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
		return this.complete();
	},

	complete: function() {
		if (this.running == true) {
			this.running = false;
			this.detachEvents();
			this.callChain();
		}
		return this;
	}

});