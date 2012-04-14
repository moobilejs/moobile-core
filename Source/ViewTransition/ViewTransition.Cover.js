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
 * @see    http://moobilejs.com/doc/0.1/ViewTransition/ViewTransition.Cover
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
	firstAnimation: function(viewToShow, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-cover-enter');
			parentElem.addClass('first');
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-enter');
			parentElem.removeClass('first');
			this.didEnterFirst(viewToShow, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
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
			parentElem.addClass('transition-cover-enter');
			viewToHide.addClass('transition-view-to-hide');
		}.bind(this);

		var onEnd = function() {
			parentView.removeClass('transition-cover-perspective');
			parentElem.removeClass('transition-cover-enter');
			viewToHide.removeClass('transition-view-to-hide');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
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

		var onStart = function() {
			parentElem.addClass('transition-cover-leave');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-leave');
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
