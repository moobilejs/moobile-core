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

	enter: function(viewToShow, viewToHide, parentView, firstViewIn) {
			
		this.setTransitionElement(parentView.content);

		parentView.addClass('transition-cubic-viewport');
		parentView.content.addClass('transition-cubic');
		parentView.content.addClass('transition-cubic-enter');

		viewToShow.addClass('transition-cubic-view-to-show');

		if (firstViewIn == false) {
			viewToHide.addClass('transition-cubic-view-to-hide');
		} 
			
		this.start(function() {
			parentView.removeClass('transition-cubic-viewport');				
			parentView.content.removeClass('transition-cubic');
			parentView.content.removeClass('transition-cubic-enter');
			viewToShow.removeClass('transition-cubic-view-to-show');
			if (firstViewIn == false) {
				viewToHide.removeClass('transition-cubic-view-to-hide');				
			}
		});

		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.setTransitionElement(parentView.content);

		parentView.addClass('transition-cubic-viewport');
		parentView.content.addClass('transition-cubic');
		parentView.content.addClass('transition-cubic-leave');
		viewToHide.addClass('transition-cubic-view-to-hide');
		viewToShow.addClass('transition-cubic-view-to-show');

		this.start(function() {
			parentView.removeClass('transition-cubic-viewport');
			parentView.content.removeClass('transition-cubic');
			parentView.content.removeClass('transition-cubic-leave');
			viewToHide.removeClass('transition-cubic-view-to-hide');
			viewToShow.removeClass('transition-cubic-view-to-show');			
		});

		return this;
	}

});