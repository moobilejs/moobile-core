/*
---

name: Request.ViewElement

description: Provides a Request that loads a view from a remote location. This 
             class will look for an element with the view data-role.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Request

provides:
	- Request.ViewElement

...
*/

Moobile.Request.ViewElement = new Class({

	Extends: Moobile.Request,

	elements: {},

	options: {
		method: 'get'
	},

	load: function(url) {
	
		var element = this.elements[url];
		if (element) {
			return element;
		}
		
		var element = null;
		
		this.addEvent('success:once', function(response) {
			element = Elements.from(response)[0] || null;		
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
