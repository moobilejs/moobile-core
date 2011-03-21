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

	options: {
		method: 'get',
		defaultView: 'Moobile.View',
		defaultController: 'Moobile.ViewController',
		defaultTransition: 'Moobile.ViewControllerTransition.Slide'
	},

	initialize: function(viewControllerStack, options) {
		this.parent(options);
		this.viewControllerStack = viewControllerStack;
		this.attachEvents();
		return this;
	},

	attachEvents: function() {
		this.addEvent('success', this.bound('gotViewController'));
		return this;
	},

	detachEvents: function() {
		this.removeEvent('success', this.bound('gotViewController'));
		return this;
	},

	getViewController: function(remote, fn) {
		this.options.url = remote;
		this.send();
		return this;
	},

	gotViewController: function(response) {

		var element = new Element('div')
			.ingest(response)
			.getElement('[data-role=view]');

		if (element) {

			var v = this.createInstanceFrom(element, 'data-view', this.options.defaultView, element);
			var c = this.createInstanceFrom(element, 'data-controller', this.options.defaultController, v);
			var t = this.createInstanceFrom(element, 'data-transition', this.options.defaultTransition);

			c.setTransition(t);

			this.viewControllerStack.pushViewController(c, t);

			return this;
		}

		throw new Moobile.Exception.ViewControllerRequest('Cannot find a view');

		return this;
	},

	createInstanceFrom: function(element, attribute, defaults) {
		var property = element.getProperty(attribute) || defaults;
		var args = Array.prototype.slice.call(arguments, 3);
		args.add(property);
		var instance = Class.from.apply(Class, args);
		return instance;
	}

});