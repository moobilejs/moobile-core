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
		navigationBar: true,
		navigationBarVisible: true
	},

	initialize: function(element, options) {
		this.parent(element, options);
		if (this.options.navigationBar) this.attachNavigationBar();
		return this;
	},

	destroy: function() {
		if (this.options.navigationBar) this.detachNavigationBar();
		return this.parent();
	},

	attachNavigationBar: function() {
		this.element.addClass('ui-navigation-bar-enabled');
		this.navigationBar = new UI.NavigationBar();
		this.navigationBar.inject(this.element, 'top');
		return this;
	},

	detachNavigationBar: function() {
		this.element.removeClass('ui-navigation-bar-enabled');
		this.navigationBar.destroy();
		this.navigationBar = null;
		return this;
	},

	setTitle: function(title) {
		if (this.navigationBar) this.navigationBar.setTitle(title);
		return this;
	},

	getTitle: function() {
		return this.navigationBar ? this.navigationBar.getTitle() : null;
	}

});