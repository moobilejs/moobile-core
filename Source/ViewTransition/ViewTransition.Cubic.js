/*
---

name: ViewTransition.Cubic

description: Provide a cubic view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Cubic

...
*/

Moobile.ViewTransition.Cubic = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		this.addSubject(parentView, 'transition-cubic-perspective');
		this.addSubject(viewToShow, 'transition-view-to-show');

		if (first) {
			this.animate(parentView.getContent(), 'transition-cubic-enter-first');
			return this;
		}

		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-cubic-enter');

		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		this.addSubject(parentView, 'transition-cubic-perspective');

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.getContent(), 'transition-cubic-leave');

		return this;
	}

});