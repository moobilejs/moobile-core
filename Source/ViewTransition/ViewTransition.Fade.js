/*
---

name: ViewTransition.Fade

description: Provide a fade-in fade-out view controller transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- ViewTransition

provides:
	- ViewTransition.Fade

...
*/

Moobile.ViewTransition.Fade = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, wrapper, firstViewIn) {

		if (firstViewIn) {

			this.setTransitionElement(viewToShow);

			viewToShow.addClass('transition-fade');
			viewToShow.addClass('transition-fade-enter-first');

			this.start(function() {
				viewToShow.removeClass('transition-fade');
				viewToShow.removeClass('transition-fade-enter-first');
			});

		} else {

			this.setTransitionElement(viewToHide);

			wrapper.addClass('transition-fade');
			wrapper.addClass('transition-fade-enter');
			viewToHide.addClass('transition-fade-view-to-hide');
			viewToShow.addClass('transition-fade-view-to-show');

			this.start(function() {
				wrapper.removeClass('transition-fade');
				wrapper.removeClass('transition-fade-enter');
				viewToHide.removeClass('transition-fade-view-to-hide');
				viewToShow.removeClass('transition-fade-view-to-show');
			});
		}

		return this;
	},

	leave: function(viewToShow, viewToHide, parentView, wrapper) {

		this.setTransitionElement(viewToHide);

		wrapper.addClass('transition-fade');
		wrapper.addClass('transition-fade-leave');
		viewToHide.addClass('transition-fade-view-to-hide');
		viewToShow.addClass('transition-fade-view-to-show');

		this.start(function() {
			wrapper.removeClass('transition-fade');
			wrapper.removeClass('transition-fade-leave');
			viewToHide.removeClass('transition-fade-view-to-hide');
			viewToShow.removeClass('transition-fade-view-to-show');
		});

		return this;
	}

});