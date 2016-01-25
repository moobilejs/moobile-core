"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.None
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var None = moobile.ViewTransition.None = new Class({

	Extends: moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {
		viewToShow.show();
		viewToHide.hide();
		this.didEnter.delay(50, this, [viewToShow, viewToHide, parentView]);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {
		viewToShow.show();
		viewToHide.hide();
		this.didLeave.delay(50, this, [viewToShow, viewToHide, parentView]);
	}

});
