/*
---

name: ViewPanelContent

description: Manages the content of a view panel.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- ViewContent

...
*/

/**
 * @class
 *
 * Manages the content of a view panel.
 *
 * <h2>Roles</h2>
 * <p><code>view-content</code> - Defined for the ViewPanel class</p>
 *
 * @name    ViewPanelContent
 * @extends ViewContent
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewPanelContent = new Class({

	Extends: Moobile.ViewContent,

	/**
	 * Return the side panel element.
	 *
	 * @return {Element} The side panel element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSidePanel: function() {
		return this.sidePanel;
	},

	/**
	 * Return the main panel element.
	 *
	 * @return {Element} The side panel element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMainPanel: function() {
		return this.mainPanel;
	},

	/**
	 * Defines an element with the main-panel and side-panel role if they were
	 * not yet defined for this view.
	 *
	 * @see Entity#willLoad
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willLoad: function() {

		this.parent();

		var main = this.getRoleElement('main-panel');
		if (main == null) {
			main = new Element('div');
			main.ingest(this.element);
			main.inject(this.element);
		}

		var side = this.getRoleElement('side-panel');
		if (side == null) {
			side = new Element('div');
			side.inject(this.element, 'top');
		}

		this.defineElementRole(main, 'main-panel');
		this.defineElementRole(side, 'side-panel');
	},

	/**
	 * Add the proper CSS classes to the view panel content's element.
	 *
	 * @see Entity#didLoad
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didLoad: function() {
		this.parent();
		this.element.addEvent('view-panel-content');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view-content', Moobile.ViewPanel, function(element, name) {
	var instance = new Moobile.ViewPanelContent(element, null, name);
	this.addChild(instance);
	this.content = instance;
});


Moobile.Entity.defineRole('side-panel', Moobile.ViewPanelContent, function(element, options) {
	this.sidePanel = new Moobile.Entity(element, options);
	this.sidePanel.addClass('side-panel');
	this.addChild(this.sidePanel);
});

Moobile.Entity.defineRole('main-panel', Moobile.ViewPanelContent, function(element, options) {
	this.mainPanel = new Moobile.Entity(element, options);
	this.mainPanel.addClass('main-panel');
	this.addChild(this.mainPanel);
});
