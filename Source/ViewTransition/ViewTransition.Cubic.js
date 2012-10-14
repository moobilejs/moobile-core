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
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition.Cubic
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.ViewTransition.Cubic = new Class({

	Extends: Moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	firstAnimation: function(viewToShow, parentView) {

		var parentElem = parentView.getContentElement();
		var parentWrap = parentView.getContentWrapperElement();

		var onStart = function() {
			parentWrap.addClass('transition-cubic-perspective');
			parentElem.addClass('first');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-cubic-perspective');
			parentElem.removeClass('first');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnterFirst(viewToShow, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-cubic-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();
		var parentWrap = parentView.getContentWrapperElement();

		var onStart = function() {
			parentWrap.addClass('transition-cubic-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-cubic-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-cubic-enter');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();
		var parentWrap = parentView.getContentWrapperElement();

		var onStart = function() {
			parentWrap.addClass('transition-cubic-perspective');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.addClass('transition-view-to-show');
		}.bind(this);

		var onEnd = function() {
			parentWrap.removeClass('transition-cubic-perspective');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');
			this.didLeave(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new Moobile.Animation(parentElem);
		animation.setAnimationClass('transition-cubic-leave');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});
