/*
---

name: Text

description: Provides the base class for managing text.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Alert

...
*/

/**
 * Provides the base class for managing text.
 *
 * @name Text
 * @class Text
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
 Moobile.Text = new Class( /** @lends Text.prototype */ {

	Extends: Moobile.Control,

	/**
	 * Set the text content.
	 * @param {String} text The text content.
	 * @return {Text}
	 * @since 0.1
	 */
	setText: function(text) {
		this.element.set('html', text);
		return this;
	},

	/**
	 * Return the text content.
	 * @param {String} text The text content.
	 * @return {Text}
	 * @since 0.1
	 */
	getText: function(text) {
		return this.element.get('html');
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {
		this.parent();
		this.element.addClass('text');
	}

});