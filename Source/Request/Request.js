/*
---

name: Request

description: Provides a base class for ajax request.

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

Moobile.Request = new Class({

	Extends: Request,

	Implements: [
		Class.Binds
	],

	options: {
		isSuccess: function() {
			var status = this.status;
			return (status == 0 || (status >= 200 && status < 300));
		}
	}

});