/*
---

name: Bar

description: Provide the base class for a Bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- BarRoles	
	- BarStyle

provides:
	- Bar

...
*/

Moobile.Bar = new Class({

	Extends: Moobile.Control,

	options: {
		className: 'bar'
	}

});