/*
---

name: Request.ViewController

description: Provides a method to load a view controller from a remote location.
             Instanciate the view controller based on data properties stored
             on the requested element.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- Request

provides:
	- Request.ViewController

...
*/

if (!window.Moobile.Request) Moobile.Request = {};

Moobile.Request.ViewController = new Class({

	Extends: Moobile.Request,

	viewControllerStack: null,

	viewControllerCache: {},

	options: {
		method: 'get'
	},

	initialize: function(viewControllerStack, options) {
		this.parent(options);
		this.viewControllerStack = viewControllerStack;
		this.attachEvents();
		return this;
	},

	attachEvents: function() {
		this.addEvent('success', this.bound('onViewControlleRequestSuccess'));
		return this;
	},

	detachEvents: function() {
		this.removeEvent('success', this.bound('onViewControlleRequestSuccess'));
		return this;
	},

	loadViewController: function(remote, fn) {

		this.addEvent('load:once', fn);

		var cached = this.getViewControllerCache(remote);
		if (cached) {
			this.fireEvent('load', cached);
			return this;
		}

		this.setViewControllerCache(remote, null);
		this.options.url = remote;
		this.send();

		return this;
	},

	setViewControllerCache: function(remote, viewController) {
		this.viewControllerCache[remote] = viewController;
		return this;
	},

	getViewControllerCache: function(remote) {
		return this.hasViewControllerCache(remote) ? this.viewControllerCache[remote] : null;
	},

	hasViewControllerCache: function(remote) {
		return this.viewControllerCache[remote] && this.viewControllerCache[remote].isStarted();
	},

	onViewControlleRequestSuccess: function(response) {

		var element = new Element('div').ingest(response).getElement('[data-role=view]');

		if (element) {

			var defaultView = this.viewControllerStack.getDefaultViewClass();
			var defaultViewController = this.viewControllerStack.getDefaultViewControllerClass();
			var defaultViewControllerTransition = this.viewControllerStack.getDefaultViewControllerTransitionClass();

			var v = this.createInstanceFrom(element, 'data-view', defaultView, element);
			var c = this.createInstanceFrom(element, 'data-view-controller', defaultViewController, v);
			var t = this.createInstanceFrom(element, 'data-view-controller-transition', defaultViewControllerTransition);

			this.setViewControllerCache(this.options.url, c);

			this.fireEvent('load', c);

			return this;
		}

		throw new Error('Cannot find a view element from the response');

		return this;
	},

	createInstanceFrom: function(element, attribute, defaults) {
		var prop = element.getProperty(attribute) || defaults;
		var args = Array.prototype.slice.call(arguments, 3);
		args.add(prop);
		var inst = Class.from.apply(Class, args);
		return inst;
	}

});