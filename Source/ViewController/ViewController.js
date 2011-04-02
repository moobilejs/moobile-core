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

	viewControllerStack: null,

	viewControllerPanel: null,

	modalViewController: null,

	transition: null,

	identifier: null,

	started: false,

	initialize: function(view) {
		this.loadView(view);
		return this;
	},

	loadView: function(view) {
		this.view = view || new Moobile.View.Scroll(new Element('div'));
		return this;
	},

	attachEvents: function() {
  		return this;
	},

	detachEvents: function() {
		return this;
	},

	doStartup: function() {
		if (this.started == false) {
			this.started = true;
			this.startup();
		}
		return this;
	},

	doShutdown: function() {
		if (this.started == true) {
			this.started = false;
			this.shutdown();
		}
		return this;
	},

	startup: function() {
		this.window = this.view.getWindow();
		this.attachEvents();
		return this;
	},

	shutdown: function() {
		this.detachEvents();
		this.view.destroy();
		this.view = null;
		this.viewControllerPanel = null;
		this.viewControllerStack = null;
		this.modalViewController = null;
		this.transition = null;
		this.window = null;
		return this;
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

	setViewControllerStack: function(viewControllerStack) {
		this.viewControllerStack = viewControllerStack;
		return this;
	},

	getViewControllerStack: function() {
		return this.viewControllerStack;
	},

	setViewControllerPanel: function(viewControllerPanel) {
		this.viewControllerPanel = viewControllerPanel;
		return this;
	},

	getViewControllerPanel: function() {
		return this.viewControllerPanel;
	},

	presentModalViewController: function(viewController, viewControllerTransition) {
		// TODO: implementation
		return this;
	},

	dismissModalViewController: function() {
		// TODO: implementation
		return this;
	},

	setTransition: function(transition) {
		this.transition = transition;
		return this;
	},

	getTransition: function() {
		return this.transition;
	},

	viewWillEnter: function() {
		this.view.willEnter();
		this.view.show();
		return this;
	},

	viewDidEnter: function() {
		this.view.didEnter();
		return this;
	},

	viewWillLeave: function() {
		this.view.willLeave();
		return this;
	},

	viewDidLeave: function() {
		this.view.didLeave();
		this.view.hide();
		return this;
	},

	viewDidRemove: function() {
		this.view.removeFromParentView();
		this.view.didRemove();
		return this;
	},
	
	navigationBarLeftButton: function() {
		return null;
	},

	navigationBarRightButton: function() {
		return null;
	}

});