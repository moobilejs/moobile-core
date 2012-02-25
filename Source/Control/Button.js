/*
---

name: Button

description: Provides a Button control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Button

...
*/

/**
 * @see    http://moobile.net/api/0.1/Control/Button
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Button = new Class(/** @lends Button.prototype */ {

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_label: null,

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('button');

		var label = this.element.getRoleElement('label');
		if (label === null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		this.addEvent('tapstart', this.bound('_onTapStart'));
		this.addEvent('tapend', this.bound('_onTapEnd'));
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this.removeEvent('tapstart', this.bound('_onTapStart'));
		this.removeEvent('tapend', this.bound('_onTapEnd'));
		this.label = null;
		this.parent();
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/Button#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setLabel: function(label) {

		if (this._label === label)
			return this;

		if (typeof label === 'string') {
			var text = label;
			label = new Moobile.Text();
			label.setText(text);
		}

		if (this._label === null) {
			this._label = label;
			this.addChild(label);
		} else {
			this.replaceChild(this._label, label, true);
			this._label = label;
		}

		label.addClass('label');

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/Button#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getLabel: function() {
		return this._label;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onTapStart: function(e) {
		this.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onTapEnd: function(e) {
		this.setHighlighted(false);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('button', null, function(element) {
	var instance = Moobile.Component.create(Moobile.Button, element, 'data-button');
	this.addChild(instance);
});

Moobile.Component.defineRole('_label', Moobile.Button, function(element) {
	var instance = Moobile.Component.create(Moobile.Text, element, 'data-_label');
	this.setLabel(instance);
});
