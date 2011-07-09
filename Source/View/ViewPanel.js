/*
---

name: ViewPanel

description: The view that must be used in conjunction with a ViewControllerPanel.

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
	
	build: function() {
		this.parent();
		this.addClass(this.options.className + '-panel');
		return this;
	}

});