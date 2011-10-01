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

	build: function(element) {

		this.parent(element);

		var sidePanel = this.getElement('[data-role=side-panel]');
		if (sidePanel == null) {
			sidePanel = new Element('div[data-role=side-panel]');
			sidePanel.inject(this.content);
		}

		var mainPanel = this.getElement('[data-role=main-panel]');
		if (mainPanel == null) {
			mainPanel = new Element('div[data-role=main-panel]');
			mainPanel.inject(this.content);
		}

		this.sidePanel = sidePanel;
		this.mainPanel = mainPanel;

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
	},

	filterOwnElement: function(element) {
		var parent = element.getParent('[data-role]');
		if (parent == null) return true;
		return parent == this.element || parent == this.content || parent == this.sidePanel || parent == this.mainPanel;
	},

});