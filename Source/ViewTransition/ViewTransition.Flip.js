
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

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentView.removeClass('transition-flip-perspective');
			parentViewContent.removeClass('transition-flip-enter');
			parentViewContent.removeClass('raise');
			viewToShow.removeClass('transition-view-to-show');

			this.didRaise(viewToShow, parentView);

		}.bind(this));

		parentView.addClass('transition-flip-perspective');
		parentViewContent.addClass('transition-flip-enter');
		parentViewContent.addClass('raise');
		viewToShow.addClass('transition-view-to-show');
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentView.removeClass('transition-flip-perspective');
			parentViewContent.removeClass('transition-flip-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didEnter(viewToShow, viewToHide, parentView);

		}.bind(this));

		parentView.addClass('transition-flip-perspective');
		parentViewContent.addClass('transition-flip-enter');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentView.removeClass('transition-flip-perspective');
			parentViewContent.removeClass('transition-flip-leave');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didLeave(viewToShow, viewToHide, parentView);

		}.bind(this));

		parentView.addClass('transition-flip-perspective');
		parentViewContent.addClass('transition-flip-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	}

});
