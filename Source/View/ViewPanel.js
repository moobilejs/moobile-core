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
 * Provides a view that handles a panel with two panes.
 *
 * @name ViewPanel
 * @class ViewPanel
 * @extends View
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewPanel = new Class( /* @lends ViewPanel.prototype */ {

	Extends: Moobile.View,

	/**
	 * Return the view content side panel element.
	 * @return {Element}
	 * @since 0.1
	 */
	getSidePanel: function() {
		return this.content.getSidePanel();
	},

	/**
	 * Return the view content main panel element.
	 * @return {Element}
	 * @since 0.1
	 */
	getMainPanel: function() {
		return this.content.getMainPanel();
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {

		this.parent();

		var className = this.options.className;
		if (className) {
			this.element.addClass(className + '-panel');
		}
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.sidePanel = null;
		this.mainPanel = null;
		this.parent();
	}

});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('content', Moobile.ViewPanel, function(element, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.ViewPanelContent, element, null, name);
	if (instance instanceof Moobile.ViewPanelContent) {
		this.addChild(instance);
		this.content = instance;
	}

	return instance;
});

