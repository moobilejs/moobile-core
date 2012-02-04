
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
 * @name  ViewTransition.None
 * @class Provide a non-animated view transition.
 *
 * @extends ViewTransition
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewTransition.None = new Class( /* @lends ViewTransition.None.prototype */ {

	Extends: Moobile.ViewTransition,

	raiseAnimation: function(viewToShow, parentView) {
		this.didRaise(viewToShow, parentView);
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {
		this.didEnter(viewToShow, viewToHide, parentView);
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {
		this.didLeave(viewToShow, viewToHide, parentView);
	}

});
