/*
---

name: Control

description: Provides the base class for controls.

license: MIT-style license.

requires:
	- View
	- ControlRoles

provides:
	- Control

...
*/

Moobile.Control = new Class({

	Extends: Moobile.View,

	Roles: Moobile.ControlRoles,

	style: null,

	disabled: false,

	selected: false,

	selectable: true,

	highlighted: false,

	highlightable: true,

	options: {
		className: null,
		styleName: null,
		disabled: false,
		selected: false,
		selectable: true,
		highlighted: false,
		highlightable: true
	},

	initialize: function(element, options, name) {

		this.parent(element, options, name);

		var styleName = this.options.styleName;
		if (styleName) {
			this.setStyle(styleName);
		}
		
		return this;
	},

	build: function() {

		this.parent();

		if (this.options.disabled) this.setDisabled(true);
		if (this.options.selected) this.setSelected(true);
		if (this.options.highlighted) this.setHighlighted(true);

		if (!this.options.selectable) this.setSelectable(false);
		if (!this.options.highlightable) this.setHighlightable(false);

		return this;
	},

	setStyle: function(style, value) {

		if (typeof style == 'object') {

			if (this.style == style)
				return this;

			if (this.style) {
				if (this.style.onDetach) {
					this.style.onDetach.call(this);
				}
			}

			this.style = null;

			if (style) {
				this.style = style;
				if (this.style.onAttach) {
					this.style.onAttach.call(this);
				}
			}

			return this;
		}

		return this.parent(style, value);
	},

	getStyle: function(style) {
		return style ? this.parent(style) : this.style;
	},

	setDisabled: function(disabled) {
		return this._setState('disabled', disabled);
	},

	isDisabled: function() {
		return this._getState('disabled');
	},

	setSelected: function(selected) {
		return this.selectable ? this._setState('selected', selected) : this;
	},

	isSelected: function() {
		return this._getState('selected');
	},

	setSelectable: function(selectable) {
		this.selectable = selectable;
		return this;
	},

	isSelectable: function() {
		return this.selectable;
	},

	setHighlighted: function(highlighted) {
		return this.highlightable ? this._setState('highlighted', highlighted) : this;
	},

	isHighlighted: function() {
		return this._getState('highlighted');
	},

	setHighlightable: function(highlightable) {
		this.highlightable = highlightable;
	},

	isHighlightable: function() {
		return this.highlightable;
	},

	_setState: function(state, value) {

		if (this[state] == value)
			return this;

		this[state] = value;

		var klass = this.options.className + '-' + state;
		if (value)	this.addClass(klass);
		else		this.removeClass(klass);

		this.fireEvent('statechange', [state, value]);

		return this;
	},

	_getState: function(state) {
		return this.states[state] || false;
	}

});