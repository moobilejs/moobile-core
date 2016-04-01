"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/ActivityIndicator
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var ActivityIndicator = moobile.ActivityIndicator = new Class({

	Extends: moobile.Control,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('activity-indicator');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ActivityIndicator#start
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	start: function() {
		return this.addClass('active');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ActivityIndicator#stop
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	stop: function() {
		return this.removeClass('active');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('activity-indicator', null, null, function(element) {
	this.addChildComponent(moobile.Component.create(ActivityIndicator, element, 'data-activity-indicator'));
});
