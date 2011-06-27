/*
---

name: ViewTransition.Cubic

description: Provide a cubic view controller transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- ViewTransition

provides:
	- ViewTransition.Cubic

...
*/

Moobile.ViewTransition.Cubic = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, wrapper, firstViewIn) {

		if (firstViewIn) {

			alert('Not yet supported...')

		} else {

			this.setTransitionElement(wrapper);

			parentView.addClass('transition-cubic-viewport');
			wrapper.addClass('transition-cubic');
			wrapper.addClass('transition-cubic-enter');
			viewToShow.addClass('transition-cubic-view-to-show');
			viewToHide.addClass('transition-cubic-view-to-hide');

			this.start(function() {
				parentView.removeClass('transition-cubic-viewport');
				wrapper.removeClass('transition-cubic');
				wrapper.removeClass('transition-cubic-enter');
				viewToShow.removeClass('transition-cubic-view-to-show');
				viewToHide.removeClass('transition-cubic-view-to-hide');
			});

		}

		return this;
	},

	leave: function(viewToShow, viewToHide, parentView, wrapper) {

		this.setTransitionElement(wrapper);

		parentView.addClass('transition-cubic-viewport');
		wrapper.addClass('transition-cubic');
		wrapper.addClass('transition-cubic-leave');
		viewToHide.addClass('transition-cubic-view-to-hide');
		viewToShow.addClass('transition-cubic-view-to-show');

		this.start(function() {
			parentView.removeClass('transition-cubic-viewport');
			wrapper.removeClass('transition-cubic');
			wrapper.removeClass('transition-cubic-leave');
			viewToHide.removeClass('transition-cubic-view-to-hide');
			viewToShow.removeClass('transition-cubic-view-to-show');
		});

		return this;
	}

});