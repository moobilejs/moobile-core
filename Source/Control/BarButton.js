/*
---

name: BarButton

description: Provides a button used inside a Bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Button
	- BarButtonStyle

provides:
	- BarButton

...
*/

Moobile.BarButton = new Class({

	Extends: Moobile.Button,

	options: {
		className: 'bar-button',
		styleName: Moobile.BarButtonStyle.Default
	},

	build: function(element) {
		this.parent(element);
		this.set('role', 'bar-button');
		return this;
	}

});