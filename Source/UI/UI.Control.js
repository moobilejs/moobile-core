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

Moobile.UI.Control = new Class({

	Extends: Moobile.UI.Element,

	disabled: false,

	style: null,

	options: {
		className: '',
		styleName: null
	},

	assemble: function() {
		this.parent();
		if (this.options.styleName) this.setStyle(this.options.styleName);
		return this;
	},

	setStyle: function(style) {
		this.removeStyle();
		this.style = style;
		this.style.attach.call(this);
		this.addClass(this.style.className);
		return this;
	},

	getStyle: function() {
		return this.style;
	},

	removeStyle: function() {
		if (this.style) {
			this.style.detach.call(this);
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
				this.detachEvents();
			} else {
				this.removeClass(this.options.className + '-disabled');
				this.attachEvents();
			}
		}
		return this;
	},

	isDisabled: function() {
		return this.disabled;
	},

	isNative: function() {
		return ['input', 'textarea', 'select', 'button'].contains(this.element.get('tag'));
	}

});