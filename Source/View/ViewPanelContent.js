/*
---

name: ViewPanelContent

description: Provides the content of a view panel.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- ViewContent

...
*/

Moobile.ViewPanelContent = new Class({

	Extends: Moobile.ViewContent,

	/**
	 * Return the side panel element.
	 * @return {Element}
	 * @since 0.1
	 */
	getSidePanel: function() {
		return this.sidePanel;
	},

	/**
	 * Return the main panel element.
	 * @return {Element}
	 * @since 0.1
	 */
	getMainPanel: function() {
		return this.mainPanel;
	},

	/**
	 * @see Entity#willLoad.
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
	}

});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('side-panel', Moobile.ViewPanelContent, function(element, options) {

	this.sidePanel = new Moobile.Entity(element, options);

	this.addChild(this.sidePanel);

	var className = this.options.className;
	if (className) {
		this.sidePanel.addClass('side-panel');
	}
});

Moobile.Entity.defineRole('main-panel', Moobile.ViewPanelContent, function(element, options) {

	this.mainPanel = new Moobile.Entity(element, options);

	this.addChild(this.mainPanel);

	var className = this.options.className;
	if (className) {
		this.mainPanel.addClass('main-panel');
	}
});
