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
 * @name  Control
 * @class Provides the base class for controls.
 *
 * @classdesc
 *
 * This class contains the method that should be used in all controls. You
 * should not instantiate this class, instead you should extend this class to
 * create your own control.
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Control = new Class( /* @lends Control.prototype */ {

	Extends: Moobile.Entity,

	/**
	 * @var    {Boolean} Whether the control is disabled.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	disabled: false,

	/**
	 * @var    {Boolean} Whether the control is selected.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	selected: false,

	/**
	 * @var    {Boolean} Whether the control is highlighted.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	highlighted: false,

	/**
	 * @var    {Boolean} Whether the control is selectable.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	selectable: true,

	/**
	 * @var    {Boolean} Whether the control is highlightable.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	highlightable: true,

	/**
	 * @var    {Object} The control options.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		className: null,
		styleName: null
	},

	/**
	 * Sets whether the control is disabled.
	 *
	 * This method will add the `is-disabled` CSS class to the control's
	 * element upon disabling. What can and cannot be done when a control is
	 * disabled is up to the control's implementation, however, core events
	 * will not be propagated when a control is disabled.
	 *
	 * @param {Boolean} value Whether the control is disabled.
	 *
	 * @return {Control} This control.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setDisabled: function(value) {
		return this._setState('disabled', value);
	},

	/**
	 * Indicate whether the control is disabled.
	 *
	 * What can and cannot be done when a control is disabled is up to the
	 * control's implementation, however, core events will not be propagated when a
	 * control is disabled.
	 *
	 * @return {Boolean} Whether the control is disabled.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isDisabled: function() {
		return this._getState('disabled');
	},

	/**
	 * Sets whether the control is selected.
	 *
	 * This method will add the `is-selected` CSS class to the control's
	 * element upon selecting. What can and cannot be done when a control is
	 * selected is up to the control's implementation as the selected state
	 * is mostly used for presentation purposes.
	 *
	 * @param {Boolean} value Whether the control is selected.
	 *
	 * @return {Control} This control.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelected: function(value) {
		return this._setState('selected', this.selectable ? value : false);
	},

	/**
	 * Indicates whether the control is selected.
	 *
	 * What can and cannot be done when a control is selected is up to the
	 * control's implementation as the selected state is mostly used for
	 * presentation purposes.
	 *
	 * @return {Boolean} Whether the control is selected.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelected: function() {
		return this._getState('selected');
	},

	/**
	 * Sets whether the control is highlighted.
	 *
	 * This method will add the `is-highlighted` CSS class to the control's
	 * element upon highlighting. What can and cannot be done when a control is
	 * selected is up to the control's implementation as the highlighted state
	 * is mostly used for presentation purposes.
	 *
	 * @param {Boolean} value Whether the control is highlighted.
	 *
	 * @return {Control} This control.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setHighlighted: function(value) {
		return this._setState('highlighted', this.highlightable ? value : false);
	},

	/**
	 * Indicate whether the control is highlighted.
	 *
	 * What can and cannot be done when a control is highlighted is up to the
	 * control's implementation as the highlighted state is mostly used for
	 * presentation purposes.
	 *
	 * @return {Boolean} Whether the control is highlighted.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isHighlighted: function() {
		return this._getState('highlighted');
	},

	/**
	 * Sets whether the control is selectable.
	 *
	 * This method will set whether this control can go from an unselected
	 * state to a selected state. However, it will not be locked as the control
	 * will always be able to go to the unselected state.
	 *
	 * @param {Boolean} value Whether the control is selectable.
	 *
	 * @return {Control} This control.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectable: function(value) {
		this.selectable = value;
		return this;
	},

	/**
	 * Indicates whether the control is selectable.
	 *
	 * This method will indicate whether this control can go from an unselected
	 * state to a selected state. However, it will not be locked as the control
	 * will always be able to go to the unselected state.
	 *
	 * @return {Boolean} Whether the control is selectable.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelectable: function() {
		return this.selectable;
	},

	/**
	 * Sets whether the control is highlightable.
	 *
	 * This method will set whether this control can go from an unhighlighted
	 * state to an highlighted state. However, it will not be locked as the
	 * control will always be able to go to the unhighlighted state.
	 *
	 * @param {Boolean} value Whether the control is highlightable.
	 *
	 * @return {Control} This control.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setHighlightable: function(value) {
		this.highlightable = value;
		return this;
	},

	/**
	 * Indicates whether the control is highlightable.
	 *
	 * This method will indicate whether this control can go from an
	 * unhighlighted state to an highlighted state. However, it will not be
	 * locked as the control will always be able to go to the unhighlighted
	 * state.
	 *
	 * @return {Boolean} selectable Whether the control is highlightable.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isHighlightable: function() {
		return this.highlightable;
	},

	_setState: function(state, value) {

		if (this[state] == value)
			return this;

		this[state] = value;

		var klass = 'is-' + state;
		if (value)	this.element.addClass(klass);
		else		this.element.removeClass(klass);

		return this;
	},

	_getState: function(state) {
		return this.states[state] || false;
	},

	onSwipe: function(e) {
		if (!this.disabled) this.parent(e);
	},

	onPinch: function(e) {
		if (!this.disabled) this.parent(e);
	},

	onClick: function(e) {
		if (!this.disabled) this.parent(e);
	},

	onMouseUp: function(e) {
		if (!this.disabled) this.parent(e);
	},

	onMouseDown: function(e) {
		if (!this.disabled) this.parent(e);
	}

});
