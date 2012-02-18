/*
---

name: Control

description: Provides the base class for controls.

license: MIT-style license.

requires:
	- Component

provides:
	- Control

...
*/

Moobile.Control = new Class({

	Extends: Moobile.Component,

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	disabled: false,

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	selected: false,

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	highlighted: false,

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	selectable: true,

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	highlightable: true,

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		className: null,
		styleName: null
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setDisabled: function(value) {
		return this._setState('disabled', value);
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isDisabled: function() {
		return this._getState('disabled');
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSelected: function(value) {
		return this._setState('selected', this.selectable ? value : false);
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isSelected: function() {
		return this._getState('selected');
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setHighlighted: function(value) {
		return this._setState('highlighted', this.highlightable ? value : false);
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isHighlighted: function() {
		return this._getState('highlighted');
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSelectable: function(value) {
		this.selectable = value;
		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isSelectable: function() {
		return this.selectable;
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setHighlightable: function(value) {
		this.highlightable = value;
		return this;
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isHighlightable: function() {
		return this.highlightable;
	},

	/**
	 * @overrides
	 */
	eventShouldFire: function(type, args) {
		return !this.disabled;
	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willSetState: function(state, value) {

	},

	/**
	 * @see http://moobile.net/api/0.1/Control/Control#element
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didSetState: function(state, value) {

	},

	/**
	 * @private
	 */
	_setState: function(state, value) {

		if (this[state] === value)
			return this;

		this.willSetState(state, value);

		this[state] = value;

		var klass = 'is-' + state;
		if (value)	this.element.addClass(klass);
		else		this.element.removeClass(klass);

		this.didSetState(state, value);

		return this;
	},

	/**
	 * @private
	 */
	_getState: function(state) {
		return this[state] || false;
	}

});
