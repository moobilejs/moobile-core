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
 * @name  ViewTransition.Cover.Box
 * @class Provides a view transition that covers the current view partially.
 *
 * @extends ViewTransition
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewTransition.Cover.Box = new Class( /* @lends ViewTransition.Cover.Box.prototype */ {

	Extends: Moobile.ViewTransition,

	overlay: null,

	viewToShowWrapper: null,

	raiseAnimation: function(viewToShow, parentView) {
		throw new Error('You cannot use this transition for the first view of a stack');
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContent();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentViewContent.removeClass('transition-cover-box-enter');
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

		parentViewContent.addClass('transition-cover-box-enter');
		viewToHide.addClass('transition-cover-box-background-view');
		viewToShow.addClass('transition-cover-box-foreground-view');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContent();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentViewContent.removeClass('transition-cover-box-leave');
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

		parentViewContent.addClass('transition-cover-box-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	}

});
