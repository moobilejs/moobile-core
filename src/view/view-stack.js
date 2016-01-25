"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.View/moobile.ViewStack
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var ViewStack = moobile.ViewStack = new Class({

	Extends: moobile.View,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('view-stack');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('view-stack', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(moobile.ViewStack, element, 'data-view-stack'));
});
