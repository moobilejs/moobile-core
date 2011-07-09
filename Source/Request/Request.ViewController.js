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
	- Core/Element
	- More/Events.Pseudos
	- Class
	- Element
	- Request

provides:
	- Request.ViewController

...
*/

if (!window.Moobile.Request) Moobile.Request = {};

Moobile.Request.ViewController = new Class({

	Extends: Moobile.Request,

	cache: {},

	options: {
		method: 'get'
	},

	initialize: function(options) {
		this.parent(options);
		this.attachEvents();
		return this;
	},

	attachEvents: function() {
		this.addEvent('success', this.bound('loaded'));
		return this;
	},

	detachEvents: function() {
		this.removeEvent('success', this.bound('loaded'));
		return this;
	},

	setCache: function(url, viewController) {
		this.cache[url] = viewController;
		return this;
	},

	getCache: function(url) {
		return this.hasCache(url) ? this.cache[url] : null;
	},

	hasCache: function(url) {
		return this.cache[url] && this.cache[url].isStarted();
	},

	load: function(url, callback) {

		var viewController = this.getCache(url);
		if (viewController) {
			callback.call(this, viewController);
			return this;
		}

		this.addEvent('load:once', callback);
		this.setCache(url, null);
		this.options.url = url;
		this.send();

		return this;
	},

	loaded: function(response) {
		var element = new Element('div').ingest(response).getElement('[data-role=view]');
		if (element) {
			
			var viewController = element.get('data-view-controller') || 'Moobile.ViewController';
			
			var view = element.get('data-view');
			if (view) {
				view = Class.instanciate(view, element);
				viewController = Class.instanciate(viewController, view);
			} else {
				viewController = Class.instanciate(viewController, element);
			}

			this.setCache(this.options.url, viewController);
			
			this.fireEvent('load', viewController);

			return this;
		}

		throw new Error('Cannot find a view element from the response');

		return this;
	}

});