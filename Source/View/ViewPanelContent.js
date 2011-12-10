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
 * @name  ViewPanelContent
 * @class Provides an entity that manages the content of a view panel.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends ViewContent
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewPanelContent = new Class({

	Extends: Moobile.ViewContent,

	/**
	 * Returns the side panel.
	 *
	 * This method will return the element that is used as the side panel of
	 * this view. The side panel is the smaller panel that generally contains
	 * the navigation elements of this view.
	 *
	 * @return {Element} The side panel.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSidePanel: function() {
		return this.sidePanel;
	},

	/**
	 * Returns the main panel.
	 *
	 * This method will return the element that is used as the main panel of
	 * this view. The side panel is the larger panel that generally contains
	 * the content elements of this view.
	 *
	 * @return {Element} The side panel.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMainPanel: function() {
		return this.mainPanel;
	},

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
