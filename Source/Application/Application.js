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

	Implements: [Events, Options],

	Binds: ['onReady'],

	viewControllerStack: null,

	viewControllerWindow: null,

	options: {
		window: 'window'
	},

	initialize: function(options) {
		this.setOptions(options);
		this.attachEvents();
		return this;
	},

	startup: function() {
		this.viewControllerStack = new Moobile.ViewController.Navigation();
		this.viewControllerWindow = new Moobile.Window(this.options.window);
		this.viewControllerWindow.setViewController(this.viewControllerStack);
		return this;
	},

	shutdown: function() {
		this.viewControllerWindow.destroy();
		this.viewControllerStack.shutdown();
		return this;
	},

	attachEvents: function() {
		window.addEvent(Event.READY, this.onReady);
		return this;
	},

	detachEvents: function() {
		window.removeEvent(Event.READY, this.onReady);
		return this;
	},

	onReady: function() {
		this.startup();
		this.fireEvent(Event.READY);
		return this;
	}
});