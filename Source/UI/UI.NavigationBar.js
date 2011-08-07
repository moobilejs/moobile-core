/*
---

name: UI.NavigationBar

description: Provide the navigation bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Bar

provides:
	- UI.NavigationBar

...
*/

Moobile.UI.NavigationBar = new Class({

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
	}

});