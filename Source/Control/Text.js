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
 * @see    http://moobilejs.com/doc/latest/Control/Text
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Text = new Class({

	Extends: Moobile.Control,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Text#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'span'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('text');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Text#setText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setText: function(text) {
		this.element.set('html',  text instanceof Moobile.Text ? text.getText() : (text || typeof text === 'number' ? text + '' : ''));
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Text#getText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getText: function() {
		return this.element.get('html');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Text#isEmpty
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	isEmpty: function() {
		return !this.getText();
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Control/Text#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Text.from = function(source) {
	if (source instanceof Moobile.Text) return source;
	var text = new Moobile.Text();
	text.setText(source);
	return text;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('text', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Text, element, 'data-text'));
});
