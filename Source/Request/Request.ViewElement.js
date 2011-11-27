/*
---

name: Request.ViewElement

description: Provides a request that returns a view element asynchrousnously.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Request

provides:
	- Request.ViewElement

...
*/

/**
 * Provides a request that returns a view element asynchrousnously.
 *
 * @name Request.ViewElement
 * @class Request.ViewElement
 * @extends Request
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Request.ViewElement = new Class( /** @lends Request.ViewElement.prototype */ {

	Extends: Moobile.Request,

	/**
	 * A cache of loaded elements.
	 * @type {Object}
	 */
	elements: {},

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		method: 'get'
	},

	/**
	 * Loads a view element from a remote files. This is done asyncronously so
	 * this methods returns the element directly.
	 * @param {String} url The url of the remote file.
	 * @return {Element}
	 * @since 0.1
	 */
	load: function(url) {

		var element = this.elements[url];
		if (element) {
			return element;
		}

		var element = null;

		this.addEvent('success:once', function(response) {
			element = Elements.from(response)[0] || null;
		});

		this.options.url = url;
		this.options.async = false
		this.send();

		if (element == null) {
			throw new Error('Cannot find an element within the response.');
		}

		this.elements[url] = element;

		return element;
	}

});
