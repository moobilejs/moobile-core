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
 * @see    http://moobile.net/api/0.1/View/ViewStack
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewStack = new Class({

	Extends: Moobile.View,

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('view-stack');
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		this.contentElement.addClass('view-stack-content');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view-stack', null, function(element) {
	this.addChild(Moobile.Component.create(Moobile.ViewStack, element, 'data-view-stack'));
});
