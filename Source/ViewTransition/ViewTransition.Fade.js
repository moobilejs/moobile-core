
/*
---

name: ViewTransition.Fade

description: Provide a fade-in fade-out view transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Fade

...
*/

Moobile.ViewTransition.Fade = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		if (first) {
			this.animate(parentView.content, 'transition-fade-enter-first');
			return this;
		}

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.content, 'transition-fade-enter');

		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		this.addSubject(viewToHide, 'transition-view-to-hide');
		this.addSubject(viewToShow, 'transition-view-to-show');

		this.animate(parentView.content, 'transition-fade-leave');

		return this;
	}

});
