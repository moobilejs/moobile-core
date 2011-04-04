/*
---

name: Application

description: Provide the base class for an application container.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- Application

...
*/

Moobile.Application = new Class({

	Implements: [Events, Options, Class.Binds],

	viewControllerStack: null,

	window: null,

	options: {
		window: 'window'
	},

	initialize: function(options) {
		this.setOptions(options);
		this.attachEvents();
		return this;
	},

	startup: function() {
		this.viewControllerStack = this.createViewControllerStack();
		this.window = this.createWindow();
		this.window.setViewController(this.viewControllerStack);
		return this;
	},

	shutdown: function() {
		this.destroyViewControllerStack();
		this.destroyWindow();
		return this;
	},

	createWindow: function() {
		return new Moobile.Window(this.options.window);
	},

	createViewControllerStack: function() {
		return new Moobile.ViewController.Stack();
	},

	destroyWindow: function() {
		this.window.destroy();
		return this;
	},

	destroyViewControllerStack: function() {
		this.viewControllerStack.shutdown();
		return this;
	},

	attachEvents: function() {
		window.addEvent(Event.READY, this.bound('onReady'));
		return this;
	},

	detachEvents: function() {
		window.removeEvent(Event.READY, this.bound('onReady'));
		return this;
	},

	onReady: function() {
		this.startup();
		this.fireEvent(Event.READY);
		return this;
	}
});