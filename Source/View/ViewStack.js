/*
---

name: ViewStack

description: Provides a view used in a ViewControllerStack.

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

		var className = this.options.className;
		if (className) {
			this.element.addClass(className + '-stack');
		}

		return this;
	}

});