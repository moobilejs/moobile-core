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

Moobile.ViewPanel = new Class({

	Extends: Moobile.View,

	mainPanel: null,

	sidePanel: null,

	/**
	 * @overrides
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
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		this.content.addClass('view-panel-content');
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this.sidePanel = null;
		this.mainPanel = null;
		this.parent();
	},

	setSidePanel: function(sidePanel) {

		if (this.sidePanel === sidePanel)
			return this;

		if (this.sidePanel === null) {
			this.content.grab(sidePanel);
			this.sidePanel = sidePanel;
		} else {
			sidePanel.replaces(this.sidePanel);
			this.sidePanel.destroy();
			this.sidePanel = sidePanel;
		}

		this.sidePanel.addClass('side-panel');

		return this;
	},

	/**
	 * Returns the side panel.
	 *
	 * This method is a conveniant shortcut that retrieves the view content
	 * then the side panel element.
	 *
	 * @return {Element} The side panel.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSidePanel: function() {
		return this.content.getSidePanel();
	},

	setMainPanel: function(mainPanel) {

		if (this.mainPanel === mainPanel)
			return this;

		if (this.mainPanel === null) {
			this.content.grab(mainPanel);
			this.mainPanel = mainPanel;
		} else {
			mainPanel.replaces(this.mainPanel);
			this.mainPanel.destroy();
			this.mainPanel = mainPanel;
		}

		this.mainPanel.addClass('main-panel');

		return this;
	},

	/**
	 * Returns the main panel.
	 *
	 * This method is a conveniant shortcut that retrieves the view content
	 * then the main panel element.
	 *
	 * @return {Element} The main panel.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMainPanel: function() {
		return this.content.getMainPanel();
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view-panel', null, function(element) {
	var instance = Moobile.Component.create(Moobile.ViewPanel, element, 'data-view-panel');
	this.addChild(instance);
});

Moobile.Component.defineRole('side-panel', Moobile.ViewPanel, {traversable: true, behavior: function(element) {
	this.setSidePanel(element);
}});

Moobile.Component.defineRole('main-panel', Moobile.ViewPanel, {traversable: true, behavior: function(element) {
	this.setMainPanel(Element);
}});
