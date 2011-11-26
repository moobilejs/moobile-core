/*
---

name: Mask

description: Provides an overlay control used to mask an entity.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Mask

...
*/

/**
 * Provides an overlay control used to mask an entity.
 *
 * @name Overlay
 * @class Overlay
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Overlay = new Class( /** @lends Overlay.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'overlay'
	},

	/**
	 * Show the overlay with an animation.
	 * @return {Overlay}
	 * @since 0.1
	 */
	showAnimated: function() {
		this.willShow();
		this.element.show();
		this.element.addClass('present');
		return this;
	},

	/**
	 * Hide the overlay with an animation.
	 * @return {Overlay}
	 * @since 0.1
	 */
	hideAnimated: function() {
		this.willHide();
		this.element.addClass('dismiss');
		return this;
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {
		this.parent();
		this.element.addEvent('animationend', this.bound('onAnimationEnd'));
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.element.removeEvent('animationend', this.bound('onAnimationEnd'));
		this.parent();
	},

	/**
	 * The animation end event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @private
	 */
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
