/*
---

name: Control

description: Provides the base class for controls.

license: MIT-style license.

requires:
	- Entity

provides:
	- Control

...
*/

/**
 * Provides the base class for controls.
 *
 * @name Control
 * @class Control
 * @extends Entity
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Control = new Class( /* @lends Control.prototype */ {

	Extends: Moobile.Entity,

	/**
	 * Whether the control is disabled.
	 * @type {Boolean}
	 */
	disabled: false,

	/**
	 * Whether the control is selected.
	 * @type {Boolean}
	 */
	selected: false,

	/**
	 * Whether the control is selectable.
	 * @type {Boolean}
	 */
	selectable: true,

	/**
	 * Whether the control is highlighted.
	 * @type {Boolean}
	 */
	highlighted: false,

	/**
	 * Whether the control is highlightable.
	 * @type {Boolean}
	 */
	highlightable: true,

	/**
	 * The control options.
	 * @type {Object}
	 */
	options: {
		className: null,
		styleName: null
	},

	/**
	 * Set whether the control is disabled.
	 * @param {Boolean} disabled Whether the control is disable.
	 * @return {Control}
	 * @since 0.1
	 */
	setDisabled: function(disabled) {
		return this._setState('disabled', disabled);
	},

	/**
	 * Indicate whether the control is disabled.
	 * @return {Boolean}
	 * @since 0.1
	 */
	isDisabled: function() {
		return this._getState('disabled');
	},

	/**
	 * Set whether the control is selected.
	 * @param {Boolean} selected Whether the control is selected.
	 * @return {Control}
	 * @since 0.1
	 */
	setSelected: function(selected) {
		return this.selectable ? this._setState('selected', selected) : this;
	},

	/**
	 * Indicate whether the control is selected.
	 * @return {Boolean}
	 * @since 0.1
	 */
	isSelected: function() {
		return this._getState('selected');
	},

	/**
	 * Set whether the control is selectable.
	 * @param {Boolean} selectable Whether the control is selectable.
	 * @return {Control}
	 * @since 0.1
	 */
	setSelectable: function(selectable) {
		this.selectable = selectable;
		return this;
	},

	/**
	 * Indicate whether the control is selectable.
	 * @param {Boolean} selectable Whether the control is selectab.e
	 * @return {Control}
	 * @since 0.1
	 */
	isSelectable: function() {
		return this.selectable;
	},

	/**
	 * Set whether the control is highlighted.
	 * @param {Boolean} highlighted Whether the control is highlighted.
	 * @return {Control}
	 * @since 0.1
	 */
	setHighlighted: function(highlighted) {
		return this.highlightable ? this._setState('highlighted', highlighted) : this;
	},

	/**
	 * Indicate whether the control is highlighted.
	 * @return {Boolean}
	 * @since 0.1
	 */
	isHighlighted: function() {
		return this._getState('highlighted');
	},

	/**
	 * Set whether the control is highlightable.
	 * @param {Boolean} highlightable Whether the control is highlightable.
	 * @return {Control}
	 * @since 0.1
	 */
	setHighlightable: function(highlightable) {
		this.highlightable = highlightable;
	},

	/**
	 * Indicate whether the control is highlightable.
	 * @param {Boolean} selectable Whether the control is highlightable.
	 * @return {Control}
	 * @since 0.1
	 */
	isHighlightable: function() {
		return this.highlightable;
	},

	/**
	 * @private
	 */
	_setState: function(state, value) {

		if (this[state] == value)
			return this;

		this[state] = value;

		var klass = 'is-' + state;
		if (value)	this.element.addClass(klass);
		else		this.element.removeClass(klass);

		this.fireEvent('statechange', [state, value]);

		return this;
	},

	/**
	 * @private
	 */
	_getState: function(state) {
		return this.states[state] || false;
	}

});
