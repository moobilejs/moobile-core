
/*
---

name: ViewTransition.Fade

description: Provide a fade-in fade-out view controller transition effect.

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

	enter: function(viewToShow, viewToHide, parentView, firstViewIn) {

		this.setTransitionElement(parentView.content);

		this.addAcceptedTarget(viewToShow);

		parentView.content.addClass('transition-fade');
		parentView.content.addClass('transition-fade-enter');

		if (firstViewIn) {

			viewToShow.addClass('transition-fade-view-to-show-first');

			this.start(function() {
				parentView.content.removeClass('transition-fade');
				parentView.content.removeClass('transition-fade-enter');
				viewToShow.removeClass('transition-fade-view-to-show-first');
			});

		} else {

			viewToHide.addClass('transition-fade-view-to-hide');
			viewToShow.addClass('transition-fade-view-to-show');

			this.start(function() {
				parentView.content.removeClass('transition-fade');
				parentView.content.removeClass('transition-fade-enter');
				viewToHide.removeClass('transition-fade-view-to-hide');
				viewToShow.removeClass('transition-fade-view-to-show');
			});
		}

		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.setTransitionElement(parentView.content);

		this.addAcceptedTarget(viewToHide);

		parentView.content.addClass('transition-fade');
		parentView.content.addClass('transition-fade-leave');
		viewToHide.addClass('transition-fade-view-to-hide');
		viewToShow.addClass('transition-fade-view-to-show');

		this.start(function() {
			parentView.content.removeClass('transition-fade');
			parentView.content.removeClass('transition-fade-leave');
			viewToHide.removeClass('transition-fade-view-to-hide');
			viewToShow.removeClass('transition-fade-view-to-show');
		});

		return this;
	}

});
