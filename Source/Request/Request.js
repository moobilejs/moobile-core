/*
---

name: Request

description: Provides a request that allow loading files locally.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Request
	- Class-Extras/Class.Binds

provides:
	- Request

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * Provides a request that allow loading files locally.
 *
 * @name Request
 * @class Request
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Request = new Class( /** @lends Request.prototype */ {

	Extends: Request,

	Implements: [
		Class.Binds
	],

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		isSuccess: function() {
			var status = this.status;
			return (status == 0 || (status >= 200 && status < 300));
		}
	}

});
