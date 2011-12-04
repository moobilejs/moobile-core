/*
---

name: ViewStack

description: Provides a view that handles an infinite number of views arrenged
             as a stack, one on the top of each others.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewStack

...
*/

/**
 * @class
 *
 * Provides a view that handles an infinite number of views arrenged as a
 * stack, one on the top of each others.
 *
 * <p><code>view-stack</code> - Defined for all classes that extends the Entity
 * class, you may specify the view class using the <code>data-view-stack</code>
 * attribute.</p>
 *
 * @name    ViewStack
 * @extends View
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewStack = new Class( /* @lends ViewStack.prototype */ {

	Extends: Moobile.View,

	/**
	 * @see Entity#didLoad
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didLoad: function() {
		this.parent();
		this.element.addClass('view-stack');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view-stack', null, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-view-stack', Moobile.ViewStack);
	this.addChild(instance);
});
