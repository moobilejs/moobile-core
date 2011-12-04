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
 * @class
 *
 * Provides a view that handles a panel with two panes.
 *
 * <h2>Roles</h2>
 * <p><code>view-panel</code> - efined for all classes that extends the Entity
 * class, you may specify the view class using the <code>data-view-panel</code>
 * attribute.</p>
 *
 * @name    ViewPanel
 * @extends View
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewPanel = new Class( /* @lends ViewPanel.prototype */ {

	Extends: Moobile.View,

	/**
	 * Return the view content side panel element.
	 *
	 * @return {Element} The side panel element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSidePanel: function() {
		return this.content.getSidePanel();
	},

	/**
	 * Return the view content main panel element.
	 *
	 * @return {Element} The main panel element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMainPanel: function() {
		return this.content.getMainPanel();
	},

	/**
	 * Add the proper CSS classes to the view panel's element.
	 *
	 * @see Entity#didLoad
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didLoad: function() {
		this.parent();
		this.element.addClass('view-panel');
	},

	/**
	 * @see Entity#destroy
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this.sidePanel = null;
		this.mainPanel = null;
		this.parent();
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view-panel', null, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-view-panel', Moobile.ViewPanel);
	this.addChild(instance);
});
