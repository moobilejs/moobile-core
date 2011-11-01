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

	getSidePanel: function() {
		return this.sidePanel;
	},

	getMainPanel: function() {
		return this.mainPanel;
	},

	rolesWillLoad: function() {
		
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
		
		this.setRole('main-panel', main);
		this.setRole('side-panel', side);
	}
	
});

/**
 * @role side-panel
 */
Moobile.Entity.defineRole('side-panel', Moobile.ViewPanelContent, function(element, options) {
	
	this.sidePanel = new Moobile.Entity(element, options);

	this.addChild(this.sidePanel);
	
	var className = this.options.className;
	if (className) {
		this.sidePanel.getElement().addClass('side-panel');
	}
	
	return this.sidePanel;
});

/**
 * @role main-panel
 */
Moobile.Entity.defineRole('main-panel', Moobile.ViewPanelContent, function(element, options) {
	
	this.mainPanel = new Moobile.Entity(element, options);
	
	this.addChild(this.mainPanel);
	
	var className = this.options.className;
	if (className) {
		this.mainPanel.getElement().addClass('main-panel');
	}
	
	return this.mainPanel;
});