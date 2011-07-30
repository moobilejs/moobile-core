/*
---

name: UI.Bar

description: Provide the base class for a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control
	- UI.BarStyle

provides:
	- UI.Bar

...
*/

Moobile.UI.Bar = new Class({

	Extends: Moobile.UI.Control,

	options: {
		className: 'ui-bar',
		styleName: Moobile.UI.BarStyle.DefaultOpaque
	},

	addBarButton: function(button, where, context) {
		return this.addChildControl(button, where, context);
	},

	getBarButton: function(name) {
		return this.getChildControl(name);
	},

	getBarButtons: function() {
		return this.getChildControls();
	},

	removeBarButton: function(button) {
		return this.removeChildControl(button);
	},

	removeBarButtons: function() {
		return this.removeChildControls();
	}

});