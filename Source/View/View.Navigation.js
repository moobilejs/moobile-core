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

	setup: function() {
		this.parent();
		this.injectNavigationBar();
		return this;
	},

	destroy: function() {
		this.destroyNavigationBar();
		return this.parent();
	},

	injectNavigationBar: function() {
		this.navigationBar = new UI.NavigationBar(this.options.navigationBarElement);
		this.navigationBar.setView(this);
		this.navigationBar.dispose();
		this.navigationBar.inject(this.element, 'top');
		this.navigationBar.hide();
		if (this.options.navigationBarVisible) this.navigationBar.show();
		return this;
	},

	destroyNavigationBar: function() {
		this.navigationBar.destroy();
		this.navigationBar = null;
		return this;
	}

});