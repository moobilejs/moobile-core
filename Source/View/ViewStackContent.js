/*
---

name: ViewStackContent

description: Manages the content of a view stack.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- ViewContent

...
*/

/**
 * Manages the content of a view stack.
 *
 * @name ViewStackContent
 * @class ViewStackContent
 * @extends ViewContent
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewStackContent = new Class({

	Extends: Moobile.ViewContent

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view-content', Moobile.ViewStack, function(element, name) {
	var instance = new Moobile.ViewStackContent(element, null, name);
	this.addChild(instance);
	this.content = instance;
});
