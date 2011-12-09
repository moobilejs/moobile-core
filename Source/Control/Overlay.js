/*
---

name: Mask

description: Provides an overlay control used to mask an entity.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Mask

...
*/

/**
 * @name  Overlay
 * @class Provides an overlay control.
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends Control
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Overlay = new Class( /** @lends Overlay.prototype */ {

	Extends: Moobile.Control,

	/**
	 * Shows the overlay with an animation.
	 *
	 * This method will show the overlay by adding the `present` CSS class to
	 * the element. Update the properties of this CSS class to create your own
	 * animation.
	 *
	 * @return {Overlay} This overlay.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	showAnimated: function() {
		this.willShow();
		this.element.show();
		this.element.addClass('present');
		return this;
	},

	/**
	 * Hides the overlay with an animation.
	 *
	 * This method will hide the overlay by adding the `dismiss` CSS class to
	 * the element. Update the properties of this CSS class to create your own
	 * animation.
	 *
	 * @return {Overlay} This overlay.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hideAnimated: function() {
		this.willHide();
		this.element.addClass('dismiss');
		return this;
	},

	destroy: function() {
		this.element.removeEvent('animationend', this.bound('onAnimationEnd'));
		this.parent();
	},

	didLoad: function() {
		this.parent();
		this.element.addClass('overlay');
		this.element.addEvent('animationend', this.bound('onAnimationEnd'));
	},

	onAnimationEnd: function(e) {

		if (this.element.hasClass('present')) this.didShow();
		if (this.element.hasClass('dismiss')) {
			this.element.hide();
			this.didHide();
		}

		this.element.removeClass('present');
		this.element.removeClass('dismiss');
	}

});
