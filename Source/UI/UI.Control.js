/*
---

name: UI.Control

description: Provides the base class for any types of controls.

license: MIT-style license.

requires:
	- UI.Element

provides:
	- UI.Control

...
*/

Moobile.UI.Control = new Class({

	Extends: Moobile.UI.Element,

	view: null,

	disabled: false,

	selected: false,

	highlighted: false,

	style: null,

	options: {
		className: '',
		styleName: null
	},

	initialize: function(element, options) {
		this.parent(element, options);

		if (this.occlude('control', this.element))
			return this.occluded;

		this.init();
		this.attachEvents();
		return this;
	},

	destroy: function() {
		this.detachEvents();
		this.release();
		this.parent();
		return this;
	},

	build: function() {
		this.parent();
		if (this.options.styleName) this.setStyle(this.options.styleName);
		return this;
	},

	init: function() {
		return this;
	},

	release: function() {
		return this;
	},

	attachEvents: function() {
		return this;
	},

	detachEvents: function() {
		return this;
	},

	setStyle: function(style, value) {
		if (typeof style == 'object') {
			this.removeStyle();
			this.style = style;
			this.style.attach.call(this);
			this.addClass(this.style.className);
		} else {
			this.parent(style, value);
		}
		return this;
	},

	getStyle: function(style) {
		return style ? this.parent(style) : this.style;
	},

	removeStyle: function(style) {
		if (style == undefined) {
			if (this.style) {
				this.style.detach.call(this);
				this.removeClass(this.style.className);
				this.style = null;
			}
		} else {
			this.parent(style);
		}
		return this;
	},

	setDisabled: function(disabled) {
		if (this.disabled != disabled) {
			this.disabled = disabled;
			if (this.disabled) {
				this.detachEvents();
				this.addClass(this.options.className + '-disabled');
				this.fireEvent('disable', this);
			} else {
				this.attachEvents();
				this.removeClass(this.options.className + '-disabled');
				this.fireEvent('enable', this);
			}
		}
		return this;
	},

	isDisabled: function() {
		return this.disabled;
	},

	setSelected: function(selected) {
		if (this.selected != selected) {
			this.selected = selected;
			if (this.selected) {
				this.addClass(this.options.className + '-selected');
				this.fireEvent('select', this);
			} else {
				this.removeClass(this.options.className + '-selected');
				this.fireEvent('deselect', this);
			}
		}
		return this;
	},

	isSelected: function() {
		return this.selected;
	},

	setHighlighted: function(highlighted) {
		if (this.highlighted != highlighted) {
			this.highlighted = highlighted;
			if (this.highlighted) {
				this.addClass(this.options.className + '-highlighted');
				this.fireEvent('highlight', this);
			} else {
				this.removeClass(this.options.className + '-highlighted');
				this.fireEvent('unhighlight', this);
			}
		}
		return this;
	},

	isHighlighted: function() {
		return this.highlighted;
	},

	isNative: function() {
		return ['input', 'textarea', 'select', 'button'].contains(this.element.get('tag'));
	},

	setView: function(view) {
		this.view = view;
		return this;
	},

	getView: function() {
		return this.view;
	},

	viewWillChange: function(parentView) {
		return this;
	},

	viewDidChange: function(parentView) {
		return this;
	}

});
