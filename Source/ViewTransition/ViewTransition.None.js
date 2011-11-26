
/*
---

name: ViewTransition.None

description: Provide a non-animated view transition

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
 * Provides a non-animated view transition.
 *
 * @name ViewTransition.None
 * @class ViewTransition.None
 * @extends ViewTransition
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewTransition.None = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @see ViewTransition#enter
	 */
	enter: function(viewToShow, viewToHide, parentView, first) {
		this.parent(viewToShow, viewToHide, parentView, first);
		this.fireEvent('stop');
		this.fireEvent('complete');
	},

	/**
	 * @see ViewTransition#leave
	 */
	leave: function(viewToShow, viewToHide, parentView) {
		this.parent(viewToShow, viewToHide, parentView);
		this.fireEvent('stop');
		this.fireEvent('complete');
	}

});
