
/*
---

name: ViewTransition.Fade

description: Provides a transition that fade under the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Fade

...
*/

/**
 * @see    http://moobile.net/api/0.1/ViewTransition/ViewTransition.Fade
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition.Fade = new Class({

	Extends: Moobile.ViewTransition,

	raiseAnimation: function(viewToShow, parentView) {

		var parentViewContent = parentView.getContent();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentViewContent.removeClass('transition-fade-enter');
			parentViewContent.removeClass('raise');
			viewToShow.removeClass('transition-view-to-show');

			this.didRaise(viewToShow, parentView);

		}.bind(this));

		parentViewContent.addClass('transition-fade-enter');
		parentViewContent.addClass('raise');
		viewToShow.addClass('transition-view-to-show');
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContent();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentViewContent.removeClass('transition-fade-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didEnter(viewToShow, viewToHide, parentView);

		}.bind(this));

		parentViewContent.addClass('transition-fade-enter');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContent();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentViewContent.removeClass('transition-fade-leave');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didLeave(viewToShow, viewToHide, parentView);

		}.bind(this));

		parentViewContent.addClass('transition-fade-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	}

});
