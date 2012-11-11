/*
---

name: ViewSet

description: Provides a view that handles an infinite number of views arrenged
             as a set.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewSet

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/View/ViewSet
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.ViewSet = new Class({

	Extends: Moobile.View,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_tabBar: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('view-set');

		var bar = this.getRoleElement('tab-bar');
		if (bar === null) {
			bar = document.createElement('div');
			bar.inject(this.element);
			bar.setRole('tab-bar');
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ViewSet#setTabBar
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setTabBar: function(tabBar) {

		if (this._tabBar === tabBar || !tabBar)
			return this;

		if (this._tabBar) {
			this._tabBar.replaceWithComponent(tabBar, true);
		} else {
			this.addChildComponent(tabBar);
		}

		this._tabBar = tabBar;
		this._tabBar.addClass('view-set-tab-bar');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ViewSet#getTabBar
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTabBar: function() {
		return this._tabBar;
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.Component.defineRole('view-set', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ViewSet, element, 'data-view-set'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.Component.defineRole('tab-bar', Moobile.ViewSet, null, function(element) {
	this.setTabBar(Moobile.Component.create(Moobile.TabBar, element, 'data-tab-bar'));
});
