/*
---

name: ViewCollection

description: Provides a view that handles an infinite number of views arrenged
             as a collection.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewCollection

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/View/ViewCollection
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.ViewCollection = new Class({

	Extends: Moobile.View,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('view-collection');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didBuild: function() {
		this.parent();
		this.setLayout('horizontal');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.Component.defineRole('view-collection', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ViewCollection, element, 'data-view-collection'));
});
