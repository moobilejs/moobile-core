/*
---

name: Label

description: Provides a control that displays a label.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Text

provides:
	- Label

...
*/

/**
 * @name  Label
 * @class Provides a label control.
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
 * @extends Text
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Label = new Class( /** @lends Label.prototype */ {

	Extends: Moobile.Text,

	didLoad: function() {
		this.parent();
		this.element.addClass('label');
	}

});
