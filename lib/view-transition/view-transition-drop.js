"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Drop
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.1
 */
var Drop = moobile.ViewTransition.Drop = new Class({

	Extends: moobile.ViewTransition,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-drop-enter');
			viewToHide.addClass('transition-view-to-hide');
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-drop-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(viewToShow);
		animation.setAnimationClass('transition-view-to-show');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.1
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-drop-leave');
			viewToShow.addClass('transition-view-to-show');
			viewToShow.show();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-drop-leave');
			viewToShow.removeClass('transition-view-to-show');
			viewToHide.hide();
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(viewToHide);
		animation.setAnimationClass('transition-view-to-hide');
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	}

});
