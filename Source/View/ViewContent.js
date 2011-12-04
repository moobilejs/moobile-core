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
 * @class
 *
 * Manages the content of a view.
 *
 * <h2>Roles</h2>
 * <p><code>view-content</code> - Defined for the View class</p>
 *
 * @name    ViewContent
 * @extends Entity
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewContent = new Class( /** @lends ViewContent.prototype */ {

	Extends: Moobile.Entity,

	/**
	 * Adds the proper CSS classes to this view content's element.
	 *
	 * @see Entity#didLoad
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didLoad: function() {
		this.parent();
		this.element.addClass('view-content');
	},

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
