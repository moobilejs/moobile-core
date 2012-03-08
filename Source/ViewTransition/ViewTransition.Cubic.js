/*
---

name: ViewTransition.Cubic

description: Provide a cubic view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Cubic

...
*/

/**
 * @see    http://moobile.net/api/0.1/ViewTransition/ViewTransition.Cubic
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Cubic = new Class({

	Extends: Moobile.ViewTransition,

	firstAnimation: function(viewToShow, parentView) {

		var parentViewContent = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentView.removeClass('transition-cubic-perspective');
			parentViewContent.removeClass('transition-cubic-enter');
			parentViewContent.removeClass('raise');
			viewToShow.removeClass('transition-view-to-show');

			this.didRaise(viewToShow, parentView);

		}.bind(this));

		parentView.addClass('transition-cubic-perspective');
		parentViewContent.addClass('transition-cubic-enter');
		parentViewContent.addClass('raise');
		viewToShow.addClass('transition-view-to-show');
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentView.removeClass('transition-cubic-perspective');
			parentViewContent.removeClass('transition-cubic-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didEnter(viewToShow, viewToHide, parentView);

		}.bind(this));

		parentView.addClass('transition-cubic-perspective');
		parentViewContent.addClass('transition-cubic-enter');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentViewContent.removeClass('transition-cubic-leave');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didLeave(viewToShow, viewToHide, parentView);

		}.bind(this));

		parentViewContent.addClass('transition-cubic-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	}

});
