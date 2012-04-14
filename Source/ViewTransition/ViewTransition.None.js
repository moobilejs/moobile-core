
/*
---

name: ViewTransition.None

description: Provide a non-animated view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.None

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition.None
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.None = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	firstAnimation: function(viewToShow, parentView) {
		this.didEnterFirst(viewToShow, parentView);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {
		this.didEnter(viewToShow, viewToHide, parentView);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {
		this.didLeave(viewToShow, viewToHide, parentView);
	}

});
