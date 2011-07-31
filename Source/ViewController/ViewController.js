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
	- Event.Loaded

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

	name: null,

	window: null,

	view: null,

	viewTransition: null,

	viewControllerStack: null,

	viewControllerPanel: null,

	viewRequest: null,

	viewLoaded: false,

	parentViewController: null,

	navigationBar: null,

	started: false,

	initialize: function(viewSource) {

		var viewElement = document.id(viewSource);
		if (viewElement) {
			this.loadViewFromElement(viewElement);
			return this;
		}

		this.loadViewFromUrl(viewSource);

		return this;
	},

	loadViewFromElement: function(viewElement) {
		this.loadView(viewElement);
		this.viewLoaded = true;
		this.fireEvent('loaded');
		return this;
	},

	loadViewFromUrl: function(viewUrl) {

		if (this.viewRequest == null) {
			this.viewRequest = new Moobile.Request.View()
		}

		this.viewRequest.cancel();
		this.viewRequest.load(viewUrl, this.bound('loadViewFromElement'));

		return this;
	},

	loadView: function(viewElement) {
		this.view = Class.instanciate(
			viewElement.get('data-view') || 'Moobile.View',
			viewElement
		);
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
		this.release();
		this.window = null;
		this.view.destroy();
		this.view = null;
		this.viewTransition = null;
		this.viewControllerStack = null;
		this.viewControllerPanel = null;
		this.parentViewController = null;
		this.navigationBar = null;
		return this;
	},

	isStarted: function() {
		return this.started;
	},

	isViewLoaded: function() {
		return this.viewLoaded;
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