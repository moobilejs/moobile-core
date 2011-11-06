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

	sidePanel: null,

	mainPanel: null,

	setup: function() {

		this.parent();

		var className = this.options.className;
		if (className) {
			this.element.addClass(className + '-panel');
		}
	},

	destroy: function() {
		this.parent();
		this.sidePanel = null;
		this.mainPanel = null;	
	},

	getSidePanel: function() {
		return this.content.getSidePanel();
	},

	getMainPanel: function() {
		return this.content.getMainPanel();
	}

});

/**
 * @role content
 */
Moobile.Entity.defineRole('content', Moobile.ViewPanel, function(element, options, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.ViewPanelContent, element, options, name);
	if (instance instanceof Moobile.ViewPanelContent) {
		this.addChild(instance);
		this.content = instance;
	}

	return instance;
});

