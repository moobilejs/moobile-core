
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
 * @see    http://moobile.net/api/0.1/ViewTransition/ViewTransition.None
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.None = new Class({

	Extends: Moobile.ViewTransition,

	firstAnimation: function(viewToShow, parentView) {
		this.didEnterFirst(viewToShow, parentView);
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {
		this.didEnter(viewToShow, viewToHide, parentView);
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {
		this.didLeave(viewToShow, viewToHide, parentView);
	}

});
