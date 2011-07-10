/*
---

name: ViewStack

description: The view that must be used in conjunction with a 
             ViewControllerStack.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewStack

...
*/

Moobile.ViewStack = new Class({

	Extends: Moobile.View,
	
	build: function() {
		this.parent();
		this.addClass(this.options.className + '-stack');
		return this;
	}

});