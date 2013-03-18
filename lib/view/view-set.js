"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.View/moobile.ViewSet
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var ViewSet = moobile.ViewSet = new Class({

	Extends: moobile.View,

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
	 * @see    http://moobilejs.com/doc/latest/moobile.View/moobile.ViewSet#setTabBar
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setTabBar: function(tabBar) {

		if (this._tabBar === tabBar || !tabBar)
			return this;

		if (this._tabBar) {
			this._tabBar.replaceWithmoobile.Component(tabBar, true);
		} else {
			this.addChildComponent(tabBar, 'footer');
		}

		this._tabBar = tabBar;
		this._tabBar.addClass('view-set-tab-bar');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/moobile.ViewSet#getTabBar
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
moobile.Component.defineRole('view-set', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(moobile.ViewSet, element, 'data-view-set'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('tab-bar', moobile.ViewSet, null, function(element) {
	this.setTabBar(moobile.Component.create(TabBar, element, 'data-tab-bar'));
});
