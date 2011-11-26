/*
---

name: BarItem

description: Provides a control that represents the content of a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- BarItem

...
*/

/**
 * Provides a control that represents the content of a bar.
 *
 * @name BarItem
 * @class BarItem
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.BarItem = new Class( /** @lends BarItem.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'bar-item'
	}

});
