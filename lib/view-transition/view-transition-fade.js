"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Fade
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Fade = moobile.ViewTransition.Fade = new Class({

	Extends: moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-fade-enter');
			viewToShow.addClass('transition-view-to-show');
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-fade-enter');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.on('start', onStart);
		animation.on('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-fade-leave');
			viewToShow.addClass('transition-view-to-show');
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-fade-leave');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(viewToHide);
		animation.setAnimationClass('transition-view-to-hide');
		animation.on('start', onStart);
		animation.on('end', onEnd);
		animation.start();
	}

});
