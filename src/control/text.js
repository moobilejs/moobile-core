"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
var Text = moobile.Text = new Class({

	Extends: moobile.Control,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	options: {
		tagName: 'span',
		text: null,
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
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	didBuild: function() {
		this.parent();
		var text = this.options.text;
		if (text) this.setText(text);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text#setText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setText: function(text) {
		this.element.set('html',  text instanceof Text ? text.getText() : (text || typeof text === 'number' ? text + '' : ''));
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text#getText
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getText: function() {
		return this.element.get('html');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text#isEmpty
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	isEmpty: function() {
		return !this.getText();
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Text#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Text.from = function(source) {
	if (source instanceof Text) return source;
	var text = new Text();
	text.setText(source);
	return text;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('text', null, function(element) {
	this.addChildComponent(moobile.Component.create(Text, element, 'data-text'));
});
