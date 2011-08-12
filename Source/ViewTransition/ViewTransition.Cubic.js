/*
---

name: ViewTransition.Cubic

description: Provide a cubic view controller transition effect.

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

		this.addSubject(parentView, 'transition-cubic-perspective');

		if (first) {
			this.animate(viewToShow, 'transition-cubic-enter-first');
			return this;
		}

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.content, 'transition-cubic-enter');

		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.addSubject(parentView, 'transition-cubic-perspective');

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.content, 'transition-cubic-leave');

		return this;
	}

});