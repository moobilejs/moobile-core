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
		scrollable: false
	},

	setup: function() {
		this.parent();
		this.element.addClass('stack-view');
		this.content.addClass('stack-view-content');
		return this;
	}

});