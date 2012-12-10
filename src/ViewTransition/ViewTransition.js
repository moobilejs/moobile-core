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
 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
Moobile.ViewTransition = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(options) {
		this.setOptions(options);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#enter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enter: function(viewToShow, viewToHide, parentView) {
		viewToHide.disableTouch();
		viewToShow.disableTouch();
		this.enterAnimation(viewToShow, viewToHide, parentView);
		this.fireEvent('start');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#leave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leave: function(viewToShow, viewToHide, parentView) {
		viewToShow.disableTouch();
		viewToHide.disableTouch();
		this.leaveAnimation(viewToShow, viewToHide, parentView);
		this.fireEvent('start');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#didEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didEnter: function(viewToShow, viewToHide, parentView) {
		viewToHide.enableTouch();
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#didLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didLeave: function(viewToShow, viewToHide, parentView) {
		viewToHide.enableTouch();
		viewToShow.enableTouch();
		this.fireEvent('complete');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#enterAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	enterAnimation: function(viewToShow, viewToHide, parentView) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewTransition/ViewTransition#leaveAnimation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	leaveAnimation: function(viewToShow, viewToHide, parentView) {
		throw new Error('You must override this method');
	}

});
