"use strict"

var View      = moobile.View;
var Component = moobile.Component;

/**
 * @see    http://moobilejs.com/doc/latest/View/ViewQueue
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var ViewQueue = moobile.ViewQueue = new Class({

	Extends: View,

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
Component.defineRole('view-queue', null, null, function(element) {
	this.addChildComponent(Component.create(ViewQueue, element, 'data-view-queue'));
});
