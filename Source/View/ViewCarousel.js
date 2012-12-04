/*
---

name: ViewCarousel

description: Provides a view that handles an a single view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewCarousel

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/View/ViewCarousel
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.ViewCarousel = new Class({

	Extends: Moobile.View,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('view-carousel');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.Component.defineRole('view-carousel', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ViewCarousel, element, 'data-view-carousel'));
});
