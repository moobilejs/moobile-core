"use strict"

var View      = moobile.View;
var Component = moobile.Component;

/**
 * @see    http://moobilejs.com/doc/latest/View/ViewCollection
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var ViewCollection = moobile.ViewCollection = new Class({

	Extends: View,

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
Component.defineRole('view-collection', null, null, function(element) {
	this.addChildComponent(Component.create(ViewCollection, element, 'data-view-collection'));
});
