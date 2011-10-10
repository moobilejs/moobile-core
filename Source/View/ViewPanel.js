/*
---

name: ViewPanel

description: Provides the view used in a ViewControllerPanel.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View
	- ViewPanelRoles

provides:
	- ViewPanel

...
*/

Moobile.ViewPanel = new Class({

	Extends: Moobile.View,

	Roles: Moobile.ViewPanelRoles,

	sidePanel: null,

	mainPanel: null,

	build: function() {

		this.parent();

		var sidePanel = this.getRolePerformer('side-panel');
		if (sidePanel == null) {
			sidePanel = new Element('div');
			sidePanel.inject(this.content);
		}

		var mainPanel = this.getRolePerformer('main-panel');
		if (mainPanel == null) {
			mainPanel = new Element('div');
			mainPanel.inject(this.content);
		}

		this.sidePanel = this.applyRole(sidePanel, 'side-panel');
		this.mainPanel = this.applyRole(mainPanel, 'main-panel');

		var className = this.options.className;
		if (className) {
			this.element.addClass(className + '-panel');
			this.sidePanel.addClass(className + '-panel-side-panel');
			this.mainPanel.addClass(className + '-panel-main-panel');
		}

		return this;
	},

	getSidePanel: function() {
		return this.sidePanel;
	},

	getMainPanel: function() {
		return this.mainPanel;
	}

});