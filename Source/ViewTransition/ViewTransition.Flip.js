
/*
---

name: ViewTransition.Flip

description: Provides a transition that flips the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Flip

...
*/

/**
 * @see    http://moobile.net/api/0.1/ViewTransition/ViewTransition.Flip
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Flip = new Class({

	Extends: Moobile.ViewTransition,

	firstAnimation: function(viewToShow, parentView) {

		var parentViewContent = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-flip-perspective');
			parentViewContent.addClass('first');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-flip-perspective');
			parentViewContent.removeClass('first');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnterFirst(viewToShow, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentViewContent);
		animation.setAnimationClass('transition-flip-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-flip-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-flip-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentViewContent);
		animation.setAnimationClass('transition-flip-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-flip-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-flip-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didLeave(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentViewContent);
		animation.setAnimationClass('transition-flip-leave');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});
