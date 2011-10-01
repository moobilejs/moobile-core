/*
---

name: Request.View

description: Provides a Request that loads a view from a remote location. This 
             class will look for an element with the view data-role.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element
	- Core/Element.Event
	- More/Events.Pseudos
	- Element.Extras
	- Request

provides:
	- Request.ViewController

...
*/

Moobile.Request.View = new Class({

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
		this.addEvent('success', this.bound('onViewLoad'));
		return this;
	},

	detachEvents: function() {
		this.removeEvent('success', this.bound('onViewLoad'));
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

		var viewElement = this.getCache(url);
		if (viewElement) {
			callback.call(this, viewElement);
			return this;
		}

		this.addEvent('load:once', callback);
		this.setCache(url, null);
		this.options.url = url;
		this.send();

		return this;
	},

	onViewLoad: function(response) {

		var viewElement = new Element('div').ingest(response).getElement('[data-role=view]');
		if (viewElement) {
			this.setCache(this.options.url, viewElement);
			this.fireEvent('load', viewElement);
			return this;
		}

		throw new Error('Cannot find a data-role=view element from the response');

		return this;
	}

});