
/*
---

name: ViewTransition.Flip

description: Provides a transition that flips the current view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.Flip

...
*/

/**
 * @name  ViewTransition.Flip
 * @class Provides a transition that flips the current view.
 *
 * @extends ViewTransition
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewTransition.Flip = new Class( /* @lends ViewTransition.Flip.prototype */ {

	Extends: Moobile.ViewTransition,

	raiseAnimation: function(viewToShow, parentView) {

		var parentViewContent = parentView.getContent();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentView.removeClass('transition-flip-perspective');
			parentViewContent.removeClass('transition-flip-enter');
			parentViewContent.removeClass('raise');
			viewToShow.removeClass('transition-view-to-show');

			this.didRaise(viewToShow, parentView);

		}.bind(this));

		parentView.addClass('transition-flip-perspective');
		parentViewContent.addClass('transition-flip-enter');
		parentViewContent.addClass('raise');
		viewToShow.addClass('transition-view-to-show');
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContent();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentView.removeClass('transition-flip-perspective');
			parentViewContent.removeClass('transition-flip-enter');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didEnter(viewToShow, viewToHide, parentView);

		}.bind(this));

		parentView.addClass('transition-flip-perspective');
		parentViewContent.addClass('transition-flip-enter');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {

		var parentViewContent = parentView.getContent();

		document.id(parentView).addEvent('animationend:once', function(e) {

			e.stop();

			parentView.removeClass('transition-flip-perspective');
			parentViewContent.removeClass('transition-flip-leave');
			viewToHide.removeClass('transition-view-to-hide');
			viewToShow.removeClass('transition-view-to-show');

			this.didLeave(viewToShow, viewToHide, parentView);

		}.bind(this));

		parentView.addClass('transition-flip-perspective');
		parentViewContent.addClass('transition-flip-leave');
		viewToHide.addClass('transition-view-to-hide');
		viewToShow.addClass('transition-view-to-show');
	}

/*
	enter: function(viewToShow, viewToHide, parentView, first) {

		this.parent(viewToShow, viewToHide, parentView, first);

		this.addSubject(parentView, 'transition-flip-perspective');
		this.addSubject(viewToShow, 'transition-view-to-show');

		if (first) {
			this.animate(parentView.getContent(), 'transition-flip-enter-first');
			return this;
		}

		this.addSubject(viewToHide, 'transition-view-to-hide');

		this.animate(parentView.content, 'transition-flip-enter');
	},

	leave: function(viewToShow, viewToHide, parentView) {

		this.parent(viewToShow, viewToHide, parentView);

		this.addSubject(parentView, 'transition-flip-perspective');

		this.addSubject(viewToHide, 'transition-view-to-hide');
		this.addSubject(viewToShow, 'transition-view-to-show');

		this.animate(parentView.getContent(), 'transition-flip-leave');
	}
	*/

});
