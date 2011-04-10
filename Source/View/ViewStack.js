/*
---

name: ViewStack

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
	- ViewStack

...
*/

Moobile.ViewStack = new Class({

	Extends: Moobile.View,

	options: {
		className: 'view-stack'
	},

	setup: function() {
		this.parent();
		this.element.addClass('view-stack');
		this.wrapper.addClass('view-stack-wrapper');
		this.content.addClass('view-stack-content');
		return this;
	}

});