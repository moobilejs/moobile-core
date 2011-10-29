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

		if (this.sidePanel == null) {
			this.sidePanel = new Element('div');
			this.sidePanel.inject(this.content);
			this.setRole('side-panel', this.sidePanel);
		}
		
		if (this.mainPanel == null) {
			this.mainPanel = new Element('div');
			this.mainPanel.inject(this.content);
			this.setRole('main-panel', this.mainPanel);
		}
	
		return this;
	},

	destroy: function() {
		this.parent();
		this.sidePanel = null;
		this.mainPanel = null;
		return this;		
	},

	getSidePanel: function() {
		return this.sidePanel;
	},

	getMainPanel: function() {
		return this.mainPanel;
	}

});

/**
 * @role side-panel
 */
Moobile.Entity.defineRole('side-panel', Moobile.ViewPanel, function(element, options) {
	
	this.sidePanel = new Moobile.Entity(element, options);

	this.addChild(this.sidePanel);
	
	var className = this.options.className;
	if (className) {
		this.sidePanel.getElement().addClass(className + '-side-panel');
	}
	
	return this.sidePanel;
});

/**
 * @role main-panel
 */
Moobile.Entity.defineRole('main-panel', Moobile.ViewPanel, function(element, options) {
	
	this.mainPanel = new Moobile.Entity(element, options);
	
	this.addChild(this.mainPanel);
	
	var className = this.options.className;
	if (className) {
		this.mainPanel.getElement().addClass(className + '-main-panel');
	}
	
	return this.mainPanel;
});