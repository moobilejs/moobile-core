/*
---

name: WindowContent

description: Provides the content of a window.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewContent

provides:
	- WindowContent

...
*/

/**
 * Manages the content of a window.
 *
 * @name WindowContent
 * @class WindowContent
 * @extends ViewContent
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.WindowContent = new Class( /** @lends WindowContent.prototype */ {

	Extends: Moobile.ViewContent,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'window-content'
	}

});
