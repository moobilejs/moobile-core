/*
---

name: View.Navigation

description: Provides the view that represents the navigation stack.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- View
	- View.Stack

provides:
	- View.Navigation

...
*/

Moobile.View.Navigation = new Class({

	Extends: Moobile.View.Stack,

	navigationBar: null,

	options: {
		className: 'navigation-view',
		navigationBar: true
	},

	initialize: function(element, options) {
		this.parent(element, options);
		if (this.options.navigationBar) {
			this.navigationBar = new UI.NavigationBar();
			this.navigationBar.inject(this.element, 'top');
			this.element.addClass('with-navigation-bar');
		}
		return this;
	}

});