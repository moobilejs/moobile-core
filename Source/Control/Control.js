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

	Extends: Moobile.Entity,

	Implements: [
		Moobile.Entity.Roles,
		Moobile.Entity.Styles
	],

	disabled: false,

	selected: false,

	selectable: true,

	highlighted: false,

	highlightable: true,

	options: {
		className: null,
		styleName: null	
	},

	setup: function() {
		this.parent();
		this.loadRoles();
		this.loadStyle();
		return this;
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