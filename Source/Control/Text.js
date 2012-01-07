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
	- Text

...
*/

/**
 * @name  Text
 * @class Provides a text control.
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
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Text = new Class( /** @lends Text.prototype */ {

	Extends: Moobile.Control,

	/**
	 * Sets the text.
	 *
	 * This method will set the given text as the `html` property of this
	 * text's element. This given text may contain HTML entities as well.
	 *
	 * @param {String} text The text content.
	 *
	 * @return {Text} This text.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setText: function(text) {
		this.element.set('html', text);
		return this;
	},

	/**
	 * Returns the text.
	 *
	 * This method will return the content of this element's `html` property.
	 * The returned text may contain HTML elements.
	 *
	 * @return {String} The text.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getText: function(text) {
		return this.element.get('html');
	},

	didBuild: function() {
		this.parent();
		this.element.addClass('text');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('text', null, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-text', Moobile.Text);
	this.addChild(instance);
});
