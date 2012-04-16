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
 * @see    http://moobilejs.com/doc/0.1/Request/Request
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Request = new Class({

	Extends: Request,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Request/Request#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		isSuccess: function() {
			var status = this.status;
			return (status === 0 || (status >= 200 && status < 300));
		}
	}

});
