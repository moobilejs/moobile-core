/*
---

name: ViewTransition.Cover

description: Provide a view transition that covers the previous view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Cover

...
*/

Moobile.ViewTransition.Cover = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		if (first) {
			this.animate(viewToShow, 'transition-cover-enter-first');
			return this;
		}

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.content, 'transition-cover-enter');

		return this;
	},
	
	onEnter: function(viewToShow, viewToHide, parentView, first) {
		
		this.parent(viewToShow, viewToHide, parentView, first);
		
		viewToHide.show();
		viewToShow.addClass('transition-cover-enter-background-view');
		viewToShow.addClass('transition-cover-enter-foreground-view');
		
		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		viewToShow.removeClass('transition-cover-enter-background-view');
		viewToShow.removeClass('transition-cover-enter-foreground-view');

		this.addSubject(viewToShow, 'transition-view-to-show');
		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.content, 'transition-cover-leave');

		return this;
	}

});