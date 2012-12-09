/*
---

name: ViewQueue

description: Provides a view that handles an a single view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewQueue

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/View/ViewQueue
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.ViewQueue = new Class({

	Extends: Moobile.View,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('view-queue');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.Component.defineRole('view-queue', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ViewQueue, element, 'data-view-queue'));
});
