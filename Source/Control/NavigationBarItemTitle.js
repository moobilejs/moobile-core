/*
---

name: NavigationBarItemTitle

description:Provides a title control used inside navigation bar item.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- NavigationBarItemTitle

...
*/

/**
 * Provides a title control used inside navigation bar item.
 *
 * @name NavigationBarItemTitle
 * @class NavigationBarItemTitle
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.NavigationBarItemTitle = new Class( /* @lends NavigationBarItemTitle.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The title text.
	 * @type {String}
	 */
	text: null,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'bar-title'
	},

	/**
	 * Set the title text.
	 * @param {String} text The title text.
	 * @return {NavigationBarItemTitle}
	 * @since 0.1
	 */
	setText: function(text) {

		if (this.text) {
			this.text = '';
		}

		if (text) {
			this.text = text;
		}

		this.element.set('html', this.text);

		return this;
	},

	/**
	 * Return the title text.
	 * @return {String}
	 * @since 0.1
	 */
	getText: function() {
		return this.text;
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.text = null;
		this.parent();
	}

});
