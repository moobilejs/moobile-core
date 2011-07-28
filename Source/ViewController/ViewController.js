/*
---

name: ViewController

description: Provides a way to handle the different states and events of a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Event
	- Core/Element
	- Core/Element.Event
	- Class-Extras/Class.Binds

provides:
	- ViewController

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.ViewController = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	window: null,

	view: null,

	viewTransition: null,

	viewControllerStack: null,

	viewControllerPanel: null,

	parentViewController: null,

	navigationBar: null,

	started: false,

	initialize: function(view) {
		this.attachView(view);
		return this;
	},

	loadView: function(element) {
		this.view = new Moobile.View(element);
		return this;
	},

	attachView: function(view) {
		if (view instanceof Element) return this.loadView(view);
		this.view = view;
		return this;
	},

	detachView: function() {
		this.view = null;
		return this;
	},

	attachEvents: function() {
  		return this;
	},

	detachEvents: function() {
		return this;
	},

	startup: function() {
		if (this.started == false) {
			this.started = true;
			this.window = this.view.window;
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
		this.navigationBar = null;
		this.window = null;
		this.release();
		this.detachView();
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