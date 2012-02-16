/*
---

name: WindowContent

description: Provides the content of a window.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewContent

provides:
	- WindowContent

...
*/

/**
 * @name  WindowContent
 * @class Provides an child that manages the content of a window.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Options]
 *
 * @extends ViewContent
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.WindowContent = new Class( /** @lends WindowContent.prototype */ {

	Extends: Moobile.ViewContent,

	willBuild: function() {
		this.parent();
		this.element.addClass('window-content');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view-content', Moobile.Window, function(element) {
	var instance = new Moobile.WindowContent(element, null, name);
	this.setContent(instance);
});
