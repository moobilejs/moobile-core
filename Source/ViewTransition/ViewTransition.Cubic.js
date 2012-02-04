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
 * @name  ViewTransition.Cubic
 * @class Provide a cubic view transition.
 *
 * @extends ViewTransition
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewTransition.Cubic = new Class( /** @lends ViewTransition.Cubic.prototype */ {

	Extends: Moobile.ViewTransition,

	raiseAnimation: function(viewToShow, parentView) {

		var parentViewContent = parentView.getContent();

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

		var parentViewContent = parentView.getContent();

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

		var parentViewContent = parentView.getContent();

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
