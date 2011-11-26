/*
---

name: ViewContent

description: Manages the content of a view.

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
 * Manages the content of a view.
 *
 * @name ViewContent
 * @class ViewContent
 * @extends Entity
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewContent = new Class( /** @lends ViewContent.prototype */ {

	Extends: Moobile.Entity,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'view-content'
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * Defines the role 'view-content' for View.
 * @since 0.1
 */
Moobile.Entity.defineRole('view-content', Moobile.View, function(element, name) {
	var instance = new Moobile.ViewContent(element, null, name);
	this.addChild(instance);
	this.content = instance; // must be assigned after addChild is called
});
