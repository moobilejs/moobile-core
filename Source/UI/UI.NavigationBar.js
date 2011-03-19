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

	left: null,

	right: null,

	title: null,

	options: {
		className: 'ui-navigation-bar'
	},

	initialize: function(element, options) {
		this.parent(element || this.create(), options);
		return this;
	},

	create: function() {
		return new Element('div').adopt(
			new Element('div.' + this.options.className + '-lf'),
			new Element('div.' + this.options.className + '-title'),
			new Element('div.' + this.options.className + '-rg')
		);
	},

	setTitle: function(title, animated) {

	},

	setLeftButton: function(button, animated) {

	},

	setRightButton: function(button, animated) {

	}

});