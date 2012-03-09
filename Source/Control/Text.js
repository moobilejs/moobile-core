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
 * @see    http://moobile.net/api/0.1/Control/Text
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Text = new Class({

	Extends: Moobile.Control,

	/**
	 * @see    http://moobile.net/api/0.1/Control/Text#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		tagName: 'span'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('text');
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/Text#setText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setText: function(text) {
		this.element.set('html', text);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/Text#getText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getText: function() {
		return this.element.get('html');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('text', null, function(element) {
	this.addChild(Moobile.Component.create(Moobile.Text, element, 'data-text'));
});
