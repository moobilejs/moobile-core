
/*
---

name: ViewTransition.Fade

description: Provides a transition that fade under the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Fade

...
*/

/**
 * @see    http://moobile.net/api/0.1/ViewTransition/ViewTransition.Fade
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Fade = new Class({

	Extends: Moobile.ViewTransition,

	firstAnimation: function(viewToShow, parentView) {

		var parentViewContent = parentView.getContentElement();

		var onStart = function() {
			parentViewContent.addClass('transition-fade-enter');
			parentViewContent.addClass('first');
			viewToShow.addClass('first');
		}.bind(this);

		var onEnd = function() {
			parentViewContent.removeClass('transition-fade-enter');
			parentViewContent.removeClass('first');
			this.didEnterFirst(viewToShow, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContentElement();

		var onStart = function() {
			parentViewContent.addClass('transition-fade-enter');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentViewContent.removeClass('transition-fade-enter');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContentElement();

		var onStart = function() {
			parentViewContent.addClass('transition-fade-leave');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentViewContent.removeClass('transition-fade-leave');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToHide);
		animation.setAnimationClass('transition-view-to-hide');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});
