/*
---

name: ViewPanel

description: Provides a view that handles a panel with two panes.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewPanel

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/View/ViewPanel
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewPanel = new Class({

	Extends: Moobile.View,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_mainPanel: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_sidePanel: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('view-panel');

		var content = this.element.getRoleElement('view-content');

		var main = content.getRoleElement('main-panel');
		if (main === null) {
			main = new Element('div');
			main.ingest(content);
			main.inject(content);
			main.setRole('main-panel');
		}

		var side = content.getRoleElement('side-panel');
		if (side === null) {
			side = new Element('div');
			side.inject(content, 'top');
			side.setRole('side-panel');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		this.contentElement.addClass('view-panel-content');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._sidePanel = null;
		this._mainPanel = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ViewPanel#setSidePanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSidePanel: function(sidePanel) {

		if (this._sidePanel === sidePanel)
			return this;

		if (this._sidePanel === null) {
			this.contentElement.grab(sidePanel);
			this._sidePanel = sidePanel;
		} else {
			sidePanel.replaces(this._sidePanel);
			this._sidePanel.destroy();
			this._sidePanel = sidePanel;
		}

		this._sidePanel.addClass('side-panel');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ViewPanel#getSidePanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSidePanel: function() {
		return this.contentElement.getSidePanel();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ViewPanel#setMainPanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setMainPanel: function(mainPanel) {

		if (this._mainPanel === mainPanel)
			return this;

		if (this._mainPanel === null) {
			this.contentElement.grab(mainPanel);
			this._mainPanel = mainPanel;
		} else {
			mainPanel.replaces(this._mainPanel);
			this._mainPanel.destroy();
			this._mainPanel = mainPanel;
		}

		this._mainPanel.addClass('main-panel');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ViewPanel#getMainPanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMainPanel: function() {
		return this.contentElement.getMainPanel();
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view-panel', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ViewPanel, element, 'data-view-panel'));
});

Moobile.Component.defineRole('side-panel', Moobile.ViewPanel, {traversable: true, behavior: function(element) {
	this.setSidePanel(element);
}});

Moobile.Component.defineRole('main-panel', Moobile.ViewPanel, {traversable: true, behavior: function(element) {
	this.setMainPanel(element);
}});
