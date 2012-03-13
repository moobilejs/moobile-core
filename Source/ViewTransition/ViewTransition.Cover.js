/*
---

name: ViewTransition.Cover

description: Provides a view transition that covers the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Cover

...
*/

/**
 * @see    http://moobile.net/api/0.1/ViewTransition/ViewTransition.Cover
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Cover = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	firstAnimation: function(viewToShow, parentView) {

		var parentElem = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentElem.removeClass('transition-cover-enter');
			parentElem.removeClass('raise');
			viewToShow.removeClass('transition-view-to-show');

			this.didEnterFirst(viewToShow, parentView);

		}.bind(this));

		parentElem.addClass('transition-cover-enter');
		parentElem.addClass('raise');
		viewToShow.addClass('transition-view-to-show');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentView.addClass('transition-cover-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-cover-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-cover-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentElem.removeClass('transition-cover-leave');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didLeave(viewToShow, viewToHide, parentView);

		}.bind(this));

		parentElem.addClass('transition-cover-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	}

});
