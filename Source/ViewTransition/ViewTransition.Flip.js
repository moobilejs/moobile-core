
/*
---

name: ViewTransition.Flip

description: Provide a flip view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Flip

...
*/

Moobile.ViewTransition.Flip = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		this.addSubject(parentView, 'transition-flip-perspective');
		this.addSubject(viewToShow, 'transition-view-to-show');

		if (first) {
			this.animate(parentView.getContent(), 'transition-flip-enter-first');
			return this;
		}

		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.content, 'transition-flip-enter');
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		this.addSubject(parentView, 'transition-flip-perspective');

		this.addSubject(viewToHide, 'transition-view-to-hide');
		this.addSubject(viewToShow, 'transition-view-to-show');

		this.animate(parentView.getContent(), 'transition-flip-leave');
	}

});
