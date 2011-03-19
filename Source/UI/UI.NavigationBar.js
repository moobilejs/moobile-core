/*
---

name: UI.NavigationBar

description: Provide the navigation bar of a navigation view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Extras/UI.Element

provides:
	- UI.NavigationBar

...
*/

UI.NavigationBar = new Class({

	Extends: UI.Control,
	
	options: {
		className: 'ui-navigation-bar'
	},

	initialize: function(element, options) {
		this.parent(element || this.create(), options);
		return this;
	},

	create: function() {
		return new Element('div');
	},

	setTitle: function(title) {
		this.element.set('html', title);
		return this;
	},

	getTitle: function() {
		return this.element.get('html');
	}

});