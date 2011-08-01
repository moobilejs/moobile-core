/*
---

name: UI.Bar.Navigation

description: Provide the navigation bar control that contains a title and two
             areas for buttons.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Bar

provides:
	- UI.Bar.Navigation

...
*/

Moobile.UI.Bar.Navigation = new Class({

	Extends: Moobile.UI.Bar,

	navigationItem : null,

	options: {
		className: 'ui-navigation-bar'
	},

	release: function() {
		this.navigationItem = null;
		this.parent();
		return this;
	},

	setNavigationItem: function(navigationItem) {
		this.removeNavigationItem();
		this.navigationItem = navigationItem;
		this.addChildControl(this.navigationItem);
		return this;
	},

	getNavigationItem: function() {
		return this.navigationItem = null;
	},

	removeNavigationItem: function() {
		if (this.navigationItem) {
			this.removeChildControl(this.navigationItem);
			this.navigationItem.destroy();
			this.navigationItem = null;
		}
		return this;
	},

	viewWillChange: function(view) {
		if (this.view) this.view.removeClass('with-' + this.options.className);
		this.parent();
		return this;
	},

	viewDidChange: function(view) {
		if (this.view) this.view.addClass('with-' + this.options.className);
		this.parent();
		return this;
	},

	willShow: function() {
		if (this.view) this.view.addClass('with-' + this.options.className);
		this.parent();
		return this;
	},

	willHide: function() {
		if (this.view) this.view.removeClass('with-' + this.options.className);
		this.parent();
		return this;
	}

});