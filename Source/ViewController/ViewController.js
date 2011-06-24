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

	viewControllerTransition: null,

	viewControllerStack: null,

	viewControllerPanel: null,

	modalViewController: null,

	transition: null,

	identifier: null,

	activated: false,

	initialize: function(view) {
		this.loadView(view);
		return this;
	},

	loadView: function(view) {
		this.view = view || new Moobile.View(new Element('div'));
		return this;
	},

	attachEvents: function() {
  		return this;
	},

	detachEvents: function() {
		return this;
	},

	activate: function() {
		if (this.activated == false) {
			this.activated = true;
			this.startup();
			this.attachEvents();
		}
		return this;
	},

	deactivate: function() {
		if (this.activated == true) {
			this.activated = false;
			this.detachEvents();
			this.shutdown();
		}
		return this;
	},

	startup: function() {
		this.view.startup();
		this.window = this.view.getWindow();
		return this;
	},

	shutdown: function() {
		this.view.destroy();
		this.view = null;
		this.modalViewController = null;
		this.viewControllerTransition = null;
		this.viewControllerStack = null;
		this.viewControllerPanel = null;
		this.transition = null;
		this.window = null;
		return this;
	},

	isStarted: function() {
		return this.started;
	},

	getId: function() {
		if (this.identifier == null) {
			this.identifier = String.uniqueID();
		}
		return this.identifier;
	},

	getHash: function() {
		return this.getTitle().length ? this.getTitle().slug() : this.getId();
	},

	getTitle: function() {
		return this.view.getTitle();
	},

	presetModalViewControllerFrom: function(url) {
		return this;
	},

	presentModalViewController: function(viewController, viewControllerTransition) {
		// TODO: implementation
		return this;
	},

	dismissModalViewController: function() {
		// TODO: implementation
		return this;
	},

	orientationDidChange: function(orientation) {
		this.view.orientationDidChange(orientation);
		return this;
	},

	viewWillEnter: function() {
		this.view.show();
		return this;
	},

	viewDidEnter: function() {
		return this;
	},

	viewWillLeave: function() {
		return this;
	},

	viewDidLeave: function() {
		this.view.hide();
		return this;
	},

	viewDidRemove: function() {
		this.view.removeFromParentView();
		return this;
	}

});