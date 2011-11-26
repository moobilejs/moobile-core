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
 * Provides a view that handles an infinite number of views arrenged as a
 * stack, one on the top of each others.
 *
 * @name ViewStack
 * @class ViewStack
 * @extends View
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewStack = new Class( /* @lends ViewStack.prototype */ {

	Extends: Moobile.View,

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {

		this.parent();

		var className = this.options.className;
		if (className) {
			this.element.addClass(className + '-stack');
		}
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view-stack', null, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-view-stack', Moobile.ViewStack);
	this.addChild(instance);
});
