"use strict"

var ViewTransition = moobile.ViewTransition;

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition.Cover.Box
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var CoverBox = moobile.ViewTransition.Box = new Class({

	Extends: moobile.ViewTransition,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	overlay: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	wrapper: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		this.overlay = new moobile.Overlay();
		this.overlay.addClass('transition-cover-box-overlay');
		this.overlay.hide();

		parentView.addChildComponent(this.overlay);

		this.wrapper = document.createElement('div');
		this.wrapper.addClass('transition-cover-box-foreground-view-wrapper');
		this.wrapper.wraps(viewToShow);

		var onStart = function() {
			parentElem.addClass('transition-cover-box-enter');
			viewToHide.addClass('transition-cover-box-background-view');
			viewToShow.addClass('transition-cover-box-foreground-view');
			viewToShow.show();
			this.overlay.showAnimated();
		}.bind(this);

		var onEnd = function() {
			parentElem.removeClass('transition-cover-box-enter');
			this.didEnter(viewToShow, viewToHide, parentView);
		}.bind(this);

		var animation = new moobile.Animation(this.wrapper);
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		var onStart = function() {
			parentElem.addClass('transition-cover-box-leave');
			this.overlay.hideAnimated();
		}.bind(this);

		var onEnd = function() {

			parentElem.removeClass('transition-cover-box-leave');
			viewToShow.removeClass('transition-cover-box-background-view');
			viewToHide.removeClass('transition-cover-box-foreground-view');
			viewToHide.hide();

			this.overlay.removeFromParentComponent();
			this.overlay.destroy();
			this.overlay = null;

			this.didLeave(viewToShow, viewToHide, parentView);

			this.wrapper.destroy();
			this.wrapper = null;

		}.bind(this);

		var animation = new moobile.Animation(this.wrapper);
		animation.addEvent('start', onStart);
		animation.addEvent('end', onEnd);
		animation.start();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	shouldHideViewToHideOnEnter: function(viewToShow, viewToHide, parentView) {
		return false;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewTransition/moobile.ViewTransition#destroy
	 * @author Yannick Gagnon (yannick.gagnon@gmail.com)
	 * @since  0.3.8
	 */
	destroy: function() {
		
		if(this.overlay) {
			this.overlay.hide();
			this.overlay.destroy();	
		}
		
		if(this.wrapper) {
			this.wrapper.remove();
		}
		
		this.parent();
	}

});
