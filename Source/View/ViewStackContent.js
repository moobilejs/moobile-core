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
 * @name  ViewStackContent
 * @class Provides an entity that manages the content of a view stack.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends ViewContent
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewStackContent = new Class({

	Extends: Moobile.ViewContent,

	didLoad: function() {
		this.parent();
		this.element.addClass('view-stack-content');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view-content', Moobile.ViewStack, function(element) {
	var instance = new Moobile.ViewStackContent(element, null, name);
	this.setContent(instance);
});
