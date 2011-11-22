/*
---

name: ViewPanel

description: Provides the view used in a ViewControllerPanel.

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
	 * Add a CSS class to the element.
	 * @since 0.1
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
	 * Destroy the view panel.
	 * @since 0.1
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

