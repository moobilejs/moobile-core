/*
---

name: View.Stack

description: Provide the view that will contains the view controller stack
             child views. This view must have a wrapper that will be double
             size of the original view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- View

provides:
	- View.Stack

...
*/

Moobile.View.Stack = new Class({

	Extends: Moobile.View,

	options: {
		className: 'stack-view',
		scrollable: false,
		wrappable: true
	},

	initialize: function(element, options) {
		this.parent(element, options);
		this.element.addClass('stack-view');
		this.wrapper.addClass('stack-view-wrapper');
		return this;
	}

});