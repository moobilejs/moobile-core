/*
---

name: UI.Control

description: Provides the base class for any types of controls.

license: MIT-style license.

requires:
	- Core/Class
	- Core/Class.Extras
	- UI.Element

provides:
	- UI.Control

...
*/

UI.Control = new Class({

	Extends: UI.Element,

	window: null,

	view: null,

	disabled: false,

	style: null,
	
	options: {
		className: '',
		styleName: ''
	},

	setStyle: function(style) {
		this.removeCurrentStyle();
		this.style = style;
		if (this.style.onAttach) this.style.onAttach.call(this);
		this.addClass(this.style.className);
		return this;
	},

	getStyle: function() {
		return this.style;
	},

	removeStyle: function(style) {
		if (style.onDetach) style.onDetach.call(this);
		this.removeClass(this.style.className);
		return this;
	},

	removeCurrentStyle: function() {
		if (this.style) this.removeStyle(this.style);
		this.style = null;
		return this;
	},

	setDisabled: function(disabled) {
		if (this.disabled != disabled) {
			this.disabled = disabled;
			if (this.disabled) {
				this.addClass(this.options.className + '-disabled');
				this.attachEvents();
			} else {
				this.removeClass(this.options.className + '-disabled');
				this.detachEvents();
			}
		}
		return this;
	},

	idDisabled: function() {
		return this.disabled;
	},

	setWindow: function(window) {
		this.window = window;
		return this;
	},

	getWindow: function() {
		return this.window;
	},

	setView: function(view) {
		this.view = view;
		return this;
	},

	getView: function() {
		return this.view;
	}

});