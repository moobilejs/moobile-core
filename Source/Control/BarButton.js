/*
---

name: BarButton

description: Provides a button used inside a Bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Button
	- BarButtonRoles	
	- BarButtonStyle

provides:
	- BarButton

...
*/

Moobile.BarButton = new Class({

	Extends: Moobile.Button,
	
	Roles: Moobile.BarButtonRoles,

	options: {
		className: 'bar-button',
		styleName: Moobile.BarButtonStyle.Default
	}

});