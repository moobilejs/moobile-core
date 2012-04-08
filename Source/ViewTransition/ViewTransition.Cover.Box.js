/*
---

name: ViewTransition.Cover.Box

description: Provides a view transition that covers the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition.Cover

provides:
	- ViewTransition.Cover

...
*/

/**
 * @see    http://moobile.net/api/0.1/ViewTransition/ViewTransition.Cover.Box
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Cover.Box = new Class({

	Extends: Moobile.ViewTransition,

	overlay: null,

	viewToShowWrapper: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	firstAnimation: function(viewToShow, parentView) {
		throw new Error('You cannot use this transition for the first view of a stack');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentElem = parentView.getContentElement();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentElem.removeClass('transition-cover-box-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didEnter(viewToShow, viewToHide, parentView);

		}.bind(this));

		this.overlay = new Moobile.Overlay();
		this.overlay.hide();
		this.overlay.showAnimated();

		viewToHide.addChild(this.overlay, 'header');

		this.viewToShowWrapper = new Moobile.View();
		this.viewToShowWrapper.addChild(viewToShow);
		this.viewToShowWrapper.addClass('transition-cover-box-foreground-view-wrapper');

		parentView.addChild(this.viewToShowWrapper);

		parentElem.addClass('transition-cover-box-enter');
		viewToHide.addClass('transition-cover-box-background-view');
		viewToShow.addClass('transition-cover-box-foreground-view');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
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

			parentElem.removeClass('transition-cover-box-leave');
			viewToHide.removeClass('transition-cover-box-background-view');
			viewToShow.removeClass('transition-cover-box-foreground-view');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			viewToHide.removeFromParent();

			this.didLeave(viewToShow, viewToHide, parentView);

			this.viewToShowWrapper.removeFromParent();
			this.viewToShowWrapper.destroy();
			this.viewToShowWrapper = null;

			this.overlay.removeFromParent();
			this.overlay.destroy();
			this.overlay = null;

		}.bind(this));

		this.overlay.hideAnimated();

		parentElem.addClass('transition-cover-box-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	}

});
