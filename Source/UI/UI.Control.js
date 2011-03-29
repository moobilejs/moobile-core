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

	disabled: false,

	name: null,

	style: null,

	options: {
		className: '',
		styleName: '',
		disabledClassName: 'disabled'
	},

	setup: function() {
		this.name = this.element.getProperty('data-name');
		return this.parent();
	},

	setName: function(name) {
		this.name = name;
		return this;
	},

	getName: function() {
		return this.name;
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
				this.addClass(this.options.disabledClassName);
				this.attachEvents();
			} else {
				this.removeClass(this.options.disabledClassName);
				this.detachEvents();
			}
		}
		return this;
	},

	idDisabled: function() {
		return this.disabled;
	}

});