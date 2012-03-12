/*
---

name: ViewTransition.Slide

description: Provide an horizontal slide view transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Slide

...
*/

/**
 * @see    http://moobile.net/api/0.1/ViewTransition/ViewTransition.Slide
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Slide = new Class({

	Extends: Moobile.ViewTransition,

	firstAnimation: function(viewToShow, parentView) {

		var parentViewContent = parentView.getContentElement();

		var animation = new Moobile.Animation();

		animation.setAnimationClass('transition-slide-enter');
		animation.addEvent('end', function() {

		})

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentViewContent.removeClass('transition-slide-enter');
			parentViewContent.removeClass('raise');
			viewToShow.removeClass('transition-view-to-show');

			this.didRaise(viewToShow, parentView);

		}.bind(this));

		parentViewContent.addClass('transition-slide-enter');
		parentViewContent.addClass('raise');
		viewToShow.addClass('transition-view-to-show');
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContentElement();

		var handler = function(e) {

			if (e.target !== parentViewContent)
				return;

			e.stop();

			parentViewContent.removeClass('transition-slide-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didEnter(viewToShow, viewToHide, parentView);

			parentViewContent.removeEvent('animationend', handler);

		}.bind(this);

		parentViewContent.addEvent('animationend', handler);

		parentViewContent.addClass('transition-slide-enter');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContentElement();

		var handler = function(e) {

			if (e.target !== parentViewContent)
				return;

			e.stop();

			parentViewContent.removeClass('transition-slide-leave');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didLeave(viewToShow, viewToHide, parentView);

			parentViewContent.removeEvent('animationend', handler);

		}.bind(this);

		parentViewContent.addEvent('animationend', handler);

		parentViewContent.addClass('transition-slide-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	}

});
