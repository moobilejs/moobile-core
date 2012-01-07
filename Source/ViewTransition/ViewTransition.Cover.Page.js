/*
---

name: ViewTransition.Cover.Page

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
 * @name  ViewTransition.Cover.Page
 * @class Provides a view transition that covers the current view.
 *
 * @extends ViewTransition
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewTransition.Cover.Page = new Class({

	Extends: Moobile.ViewTransition,

	overlay: null,

	raiseAnimation: function(viewToShow, parentView) {
		throw new Error('You cannot use this transition for the first view of a stack');
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContent();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentViewContent.removeClass('transition-cover-page-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didEnter(viewToShow, viewToHide, parentView);

		}.bind(this));

		this.overlay = new Moobile.Overlay();
		this.overlay.hide();
		this.overlay.showAnimated();

		viewToHide.addChild(this.overlay, 'header');

		parentViewContent.addClass('transition-cover-page-enter');
		viewToHide.addClass('transition-cover-page-background-view');
		viewToShow.addClass('transition-cover-page-foreground-view');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContent();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentViewContent.removeClass('transition-cover-page-leave');
			viewToHide.removeClass('transition-cover-page-background-view');
			viewToShow.removeClass('transition-cover-page-foreground-view');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didLeave(viewToShow, viewToHide, parentView);

			this.overlay.removeFromParent();
			this.overlay.destroy();
			this.overlay = null;

		}.bind(this));

		this.overlay.hideAnimated();

		parentViewContent.addClass('transition-cover-page-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	}

});
