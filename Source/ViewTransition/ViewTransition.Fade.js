
/*
---

name: ViewTransition.Fade

description: Provides a transition that fade under the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Fade

...
*/

/**
 * Provides a transition that fade under the current view.
 *
 * @name ViewTransition.Fade
 * @class ViewTransition.Fade
 * @extends ViewTransition
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewTransition.Fade = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @see ViewTransition#enter
	 */
	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		if (first) {
			this.animate(parentView.getContent(), 'transition-fade-enter-first');
			return this;
		}

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-fade-enter');
	},

	/**
	 * @see ViewTransition#leave
	 */
	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		this.addSubject(viewToHide, 'transition-view-to-hide');
		this.addSubject(viewToShow, 'transition-view-to-show');

		this.animate(parentView.getContent(), 'transition-fade-leave');
	}

});
