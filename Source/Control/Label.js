/*
---

name: Label

description: Provides a control that displays a label.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Label

...
*/

/**
 * Provides a control that displays a label.
 *
 * @name Label
 * @class Label
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Label = new Class( /** @lends Label.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'label'
	},

	/**
	 * Set the label text.
	 * @param {String} text The label text.
	 * @return {Label}
	 * @since 0.1
	 */
	setText: function(text) {
		this.element.set('html', text);
		return this;
	},

	/**
	 * Return the label text.
	 * @return {String}
	 * @since 0.1
	 */
	getText: function() {
		return this.element.get('html');
	}

});
