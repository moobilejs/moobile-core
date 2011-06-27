/*
---

name: ViewController

description: Provides a way to handle the different states and events of a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- ViewController

...
*/

Moobile.ViewController = new Class({

	Implements: [Events, Options, Class.Binds],

	window: null,

	view: null,

	viewTransition: null,

	viewControllerStack: null,

	viewControllerPanel: null,

	parentViewController: null,

	navigationBar: null,

	started: false,

	initialize: function(view) {
		this.loadView(view);
		return this;
	},

	loadView: function(view) {
		this.view = view || new Moobile.View();
		Object.assertInstanceOf(this.view, Moobile.View, 'Moobile.ViewController view must be an intance of Moobile.View');
		return this;
	},

	attachEvents: function() {
  		return this;
	},

	detachEvents: function() {
		return this;
	},

	startup: function() {
//		trace(this.view.element, this.view.window, '----------------------------------');
		if (this.started == false) {
			this.started = true;
			this.window = this.view.getWindow();
			this.init();
			this.attachEvents();
		}
		return this;
	},

	destroy: function() {
		this.started = false;
		this.detachEvents();
		this.viewTransition = null;
		this.viewControllerStack = null;
		this.viewControllerPanel = null;
		this.parentViewController = null;
		this.window = null;
		this.view = null;
		this.release();
		return this;
	},

	isStarted: function() {
		return this.started;
	},

	init: function() {
		return this;
	},

	release: function() {
		return this;
	},

	getTitle: function() {
		return this.view.getTitle();
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