/*
---

name: NavigationBar

description: Provide the navigation bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar

provides:
	- NavigationBar

...
*/

Moobile.NavigationBar = new Class({

	Extends: Moobile.Bar,

	navigationItem: null,

	build: function(element) {

		this.parent(element);

		var navigationItem = this.getElement('[data-role=navigation-item]');
		if (navigationItem == null) {
			navigationItem = new Element('div[data-role=navigation-item]');
			navigationItem.ingest(this.content);
			navigationItem.inject(this.content);
		}

		this.navigationItem = this.getRoleInstance(navigationItem);

		if (this.options.className) {
			this.element.addClass('navigation-' + this.options.className);
		}

		return this;
	},

	setNavigationItem: function(navigationItem) {

		if (this.navigationItem == navigationItem)
			return this;

		if (navigationItem) {

			if (navigationItem instanceof Element) {
				navigationItem = new Moobile.NavigationItem(navigationItem);
			}

			this.replaceChildView(this.navigationItem, navigationItem);
			this.navigationItem.destroy();
			this.navigationItem = navigationItem;
		}

		return this;
	},

	getNavigationItem: function() {
		return this.navigationItem;
	},

	release: function() {
		this.navigationItem = null;
		this.parent();
		return this;
	}

});