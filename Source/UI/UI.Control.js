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

	style: null,

	disabled: false,
		
	options: {
		className: '',
		styleName: null
	},

	setup: function() {
		if (this.options.styleName) this.setStyle(this.options.styleName);
		return this.parent();
	},

	setStyle: function(style) {
		this.removeStyle();
		this.style = style;
		this.style.onAttach.call(this);
		this.addClass(this.style.className);
		return this;
	},

	getStyle: function() {
		return this.style;
	},

	removeStyle: function() {
		if (this.style) {
			this.style.onDetach.call(this);
			this.removeClass(this.style.className);
			this.style = null;
		}
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
	}

});