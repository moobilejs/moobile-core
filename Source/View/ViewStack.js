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
 * @name  ViewStack
 * @class Provides a view that handles an infinite number of views arrenged as
 *        a stack, one on the top of each others.
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
 * @extends View
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewStack = new Class( /* @lends ViewStack.prototype */ {

	Extends: Moobile.View,

	didLoad: function() {
		this.parent();
		this.element.addClass('view-stack');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view-stack', null, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-view-stack', Moobile.ViewStack);
	this.addChild(instance);
});
