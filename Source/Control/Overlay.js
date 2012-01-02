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
 * @classdesc
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

	destroy: function() {
		this.element.removeEvent('animationend', this.bound('onAnimationEnd'));
		this.parent();
	},

	/**
	 * Shows the overlay with an animation.
	 *
	 * This method will show the overlay by adding the `show-animated` CSS
	 * class to the element. Update the properties of this CSS class to
	 * customize the animation.
	 *
	 * @return {Overlay} This overlay.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	showAnimated: function() {
		this.willShow();
		this.element.show();
		this.element.addClass('show-animated');
		return this;
	},

	/**
	 * Hides the overlay with an animation.
	 *
	 * This method will hide the overlay by adding the `hide-animated` CSS
	 * class to the element. Update the properties of this CSS class to
	 * customize the animation.
	 *
	 * @return {Overlay} This overlay.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hideAnimated: function() {
		this.willHide();
		this.element.addClass('hide-animated');
		return this;
	},

	didLoad: function() {
		this.parent();
		this.element.addClass('overlay');
		this.element.addEvent('animationend', this.bound('onAnimationEnd'));
	},

	onAnimationEnd: function(e) {

		e.stop();

		if (this.element.hasClass('show-animated')) {
			this.element.removeClass('show-animated');
			this.didShow();
		}

		if (this.element.hasClass('hide-animated')) {
			this.element.removeClass('hide-animated');
			this.element.hide();
			this.didHide();
		}
	}

});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('radial', Moobile.Bar, {
	attach: function(element) { element.addClass('style-radial'); },
	detach: function(element) { element.removeClass('style-radial'); }
});
