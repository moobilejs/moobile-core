/*
---

name: ViewControllerTransition.Slide

description: Provide a slide view controller transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- ViewControllerTransition

provides:
	- ViewControllerTransition.Slide

...
*/

Moobile.ViewControllerTransition.Slide = new Class({

	Extends: Moobile.ViewControllerTransition,

	enter: function(viewToShow, viewToHide, parentView, wrapper, firstViewIn) {

		this.setTransitionElement(wrapper);

		wrapper.addClass('transition-slide');
		wrapper.addClass('transition-slide-enter');

		viewToShow.addClass('transition-slide-view-to-show');

		if (firstViewIn) {
			viewToShow.addClass('transition-slide-view-to-show-first');
		} else {
			viewToHide.addClass('transition-slide-view-to-hide');
		}

		this.start(function() {
			wrapper.removeClass('transition-slide');
			wrapper.removeClass('transition-slide-enter');
			viewToShow.removeClass('transition-slide-view-to-show');
			viewToShow.removeClass('transition-slide-view-to-show-first');
			if (viewToHide) {
				viewToHide.removeClass('transition-slide-view-to-hide');
			}
		});

		return this;
	},

	leave: function(viewToShow, viewToHide, parentView, wrapper) {

		this.setTransitionElement(wrapper);

		wrapper.addClass('transition-slide');
		wrapper.addClass('transition-slide-leave');
		viewToShow.addClass('transition-slide-view-to-show');
		viewToHide.addClass('transition-slide-view-to-hide');

		this.start(function() {
			wrapper.removeClass('transition-slide');
			wrapper.removeClass('transition-slide-leave');
			viewToShow.removeClass('transition-slide-view-to-show');
			viewToHide.removeClass('transition-slide-view-to-hide');
		});

		return this;
	}

});