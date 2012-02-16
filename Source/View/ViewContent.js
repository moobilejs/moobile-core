/*
---

name: ViewContent

description: Manages the content of a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventDispatcher

provides:
	- ViewContent

...
*/

/**
 * @name  ViewContent
 * @class Provides an child that manages the content of a view.
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
 * @extends EventDispatcher
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewContent = new Class( /** @lends ViewContent.prototype */ {

	Extends: Moobile.Component,

	willBuild: function() {
		this.parent();
		this.element.addClass('view-content');
	},

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view-content', Moobile.View, function(element) {
	var instance = new Moobile.ViewContent(element, null, name);
	this.setContent(instance);
});
