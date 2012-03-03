/*
---

name: ViewTransition

description: Provides the base class that applies view transition.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Element
	- Core/Element.Event
	- Core/Element.Style
	- Class-Extras/Class.Binds
	- Event.CSS3

provides:
	- ViewTransition

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * @see    http://moobile.net/api/0.1/ViewTransition/ViewTransition
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewTransition = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	options: {},

	initialize: function(options) {
		this.setOptions(options);
		return this;
	},

	enter: function(viewToShow, viewToHide, parentView, isFirstView) {

		if (viewToHide) {
			viewToHide.disableTouch();
		}

		viewToShow.show();
		viewToShow.disableTouch();

		this.fireEvent('start');

		if (isFirstView) {
			this.raiseAnimation(viewToShow, parentView)
		} else {
			this.enterAnimation(viewToShow, viewToHide, parentView);
		}

		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {

		viewToShow.show();
		viewToShow.disableTouch();
		viewToHide.disableTouch();

		this.fireEvent('start');
		this.leaveAnimation(viewToShow, viewToHide, parentView);

		return this;
	},

	didRaise: function(viewToShow, parentView) {
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	didEnter: function(viewToShow, viewToHide, parentView) {
		viewToHide.hide();
		viewToHide.enableTouch();
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	didLeave: function(viewToShow, viewToHide, parentView) {
		viewToHide.hide();
		viewToHide.enableTouch();
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	raiseAnimation: function(viewToShow, parentView) {
		throw new Error('You must override this method');
	},

	enterAnimation: function(viewToShow, viewToHide, parentView) {
		throw new Error('You must override this method');
	},

	leaveAnimation: function(viewToShow, viewToHide, parentView) {
		throw new Error('You must override this method');
	}

});
