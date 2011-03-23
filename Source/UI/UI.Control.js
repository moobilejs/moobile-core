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

	setName: function(name) {
		this.name = name;
		return this;
	},

	getName: function() {
		return this.name;
	},

	setStyle: function(style) {
		this.removeClass(this.style);
		this.addClass(style);
		this.style = style;
		return this;
	},

	getStyle: function() {
		return this.style;
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