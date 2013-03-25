"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var TabBar = moobile.TabBar = new Class({

	Extends: moobile.Bar,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__selectedTab: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__selectedTabIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	options: {
		selectedTabIndex: -1,
		tabs: null,
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('tab-bar');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didBuild: function() {
		this.parent();
		var tabs = this.options.tabs;
		if (tabs) this.addTabs(tabs);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#setSelectedTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setSelectedTab: function(selectedTab) {

		if (this.__selectedTab === selectedTab)
			return this;

		if (this.__selectedTab) {
			this.__selectedTab.setSelected(false);
			this.fireEvent('deselect', this.__selectedTab);
			this.__selectedTab = null;
		}

		this.__selectedTabIndex = selectedTab ? this.getChildComponentIndex(selectedTab) : -1;

		if (selectedTab) {
			this.__selectedTab = selectedTab;
			this.__selectedTab.setSelected(true);
			this.fireEvent('select', this.__selectedTab);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#getSelectedTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getSelectedTab: function() {
		return this.__selectedTab;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#setSelectedTabIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setSelectedTabIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentByTypeAt(Tab, index);
		}

		return this.setSelectedTab(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#getSelectedTabIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getSelectedTabIndex: function() {
		return this.__selectedTabIndex;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#clearSelectedTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	clearSelectedTab: function() {
		this.setSelectedTab(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTab: function(tab, where) {
		return this.addChildComponent(Tab.from(tab), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTabAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabAfter: function(tab, after) {
		return this.addChildComponentAfter(Tab.from(tab), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTabBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabBefore: function(tab, before) {
		return this.addChildComponentBefore(Tab.from(tab), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTabs
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabs: function(tabs, where) {
		return this.addChildComponents(Tab.from(tab), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTabsAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabsAfter: function(tabs, after) {
		return this.addChildComponentsAfter(tabs.map(function(tab) {
			return Tab.from(tab);
		}), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#addTabsBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabsBefore: function(tabs, before) {
		return this.addChildComponentsBefore(tabs.map(function(tab) {
			return Tab.from(tab);
		}), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#getTabs
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTabs: function() {
		return this.getChildComponentsByType(Tab);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#getTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTab: function(name) {
		return this.getChildComponentByType(Tab, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#getTabAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTabAt: function(index) {
		return this.getChildComponentByTypeAt(Tab, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#removeTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeTab: function(tab, destroy) {
		return this.removeChildComponent(tab, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Tabmoobile.Bar#removeAllTabs
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeAllTabs: function(destroy) {
		return this.removeAllChildComponentsByType(Tab, destroy);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		if (this.__selectedTab === component) {
			this.clearSelectedTab();
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didAddChildComponent: function(child) {
		this.parent(child);
		if (child instanceof moobile.Tab) {
			child.addEvent('tap', this.bound('__onTabTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didRemoveChildComponent: function(child) {
		this.parent(child);
		if (child instanceof moobile.Tab) {
			child.removeEvent('tap', this.bound('__onTabTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didChangeState: function(state) {
		this.parent(state)
		if (state === 'disabled' || state == null) {
			this.getChildComponents().invoke('setDisabled', state);
		}
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__onTabTap: function(e, sender) {
		this.setSelectedTab(sender);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
moobile.Component.defineRole('tab-bar', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(Tabmoobile.Bar, element, 'data-tab-bar'));
});
