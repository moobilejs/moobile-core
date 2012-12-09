/*
---

name: TabBar

description: Provides a bar control used to navigate between views.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar

provides:
	- TabBar

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/TabBar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.TabBar = new Class({

	Extends: Moobile.Bar,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_selectedTab: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_selectedTabIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#options
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
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#setSelectedTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setSelectedTab: function(selectedTab) {

		if (this._selectedTab === selectedTab)
			return this;

		if (this._selectedTab) {
			this._selectedTab.setSelected(false);
			this.fireEvent('deselect', this._selectedTab);
			this._selectedTab = null;
		}

		this._selectedTabIndex = selectedTab ? this.getChildComponentIndex(selectedTab) : -1;

		if (selectedTab) {
			this._selectedTab = selectedTab;
			this._selectedTab.setSelected(true);
			this.fireEvent('select', this._selectedTab);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#getSelectedTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getSelectedTab: function() {
		return this._selectedTab;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#setSelectedTabIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setSelectedTabIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentByTypeAt(Moobile.Tab, index);
		}

		return this.setSelectedTab(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#getSelectedTabIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getSelectedTabIndex: function() {
		return this._selectedTabIndex;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#clearSelectedTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	clearSelectedTab: function() {
		this.setSelectedTab(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#addTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTab: function(tab, where) {
		return this.addChildComponent(Moobile.Tab.from(tab), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#addTabAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabAfter: function(tab, after) {
		return this.addChildComponentAfter(Moobile.Tab.from(tab), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#addTabBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabBefore: function(tab, before) {
		return this.addChildComponentBefore(Moobile.Tab.from(tab), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#addTabs
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabs: function(tabs, where) {
		return this.addChildComponents(Moobile.Tab.from(tab), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#addTabsAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabsAfter: function(tabs, after) {
		return this.addChildComponentsAfter(tabs.map(function(tab) {
			return Moobile.Tab.from(tab);
		}), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#addTabsBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addTabsBefore: function(tabs, before) {
		return this.addChildComponentsBefore(tabs.map(function(tab) {
			return Moobile.Tab.from(tab);
		}), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#getTabs
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTabs: function() {
		return this.getChildComponentsByType(Moobile.Tab);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#getTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTab: function(name) {
		return this.getChildComponentByType(Moobile.Tab, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#getTabAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTabAt: function(index) {
		return this.getChildComponentByTypeAt(Moobile.Tab, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#removeTab
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeTab: function(tab, destroy) {
		return this.removeChildComponent(tab, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/TabBar#removeAllTabs
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeAllTabs: function(destroy) {
		return this.removeAllChildComponentsByType(Moobile.Tab, destroy);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		if (this._selectedTab === component) {
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
		if (child instanceof Moobile.Tab) {
			child.addEvent('tap', this.bound('onTabTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didRemoveChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Moobile.Tab) {
			child.removeEvent('tap', this.bound('onTabTap'));
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

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	onTabTap: function(e, sender) {
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
Moobile.Component.defineRole('tab-bar', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.TabBar, element, 'data-tab-bar'));
});
