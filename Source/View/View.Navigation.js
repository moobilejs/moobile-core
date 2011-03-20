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
		navigationBarVisible: true,
		navigationBarElement: null
	},

	initialize: function(element, options) {
		this.parent(element, options);
		this.attachNavigationBar();
		return this;
	},

	destroy: function() {
		if (this.options.navigationBar) this.detachNavigationBar();
		return this.parent();
	},

	attachNavigationBar: function() {
		this.navigationBar = new UI.NavigationBar(this.options.navigationBarElement);
		this.navigationBar.setView(this);
		this.navigationBar.dispose();
		this.navigationBar.inject(this.element, 'top');
		this.navigationBar.hide();
		if (this.options.navigationBarVisible) this.navigationBar.show();
		return this;
	},

	detachNavigationBar: function() {
		this.navigationBar.destroy();
		this.navigationBar = null;
		return this;
	}

});