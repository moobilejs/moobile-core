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

	parentControl: null,

	childControls: [],

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

		this.attachChildControls();
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

	addChildControl: function(control, where, context) {
		this.willAddChildControl(control);
		this.hook(control, where, context);
		this.bindChildControl(control);
		this.didAddChildControl(control);
		return this;
	},

	getChildControl: function(name) {
		return this.childControls.find(function(childControl) {
			return childControl.name == name;
		});
	},

	getChildControls: function() {
		return this.childControls;
	},

	removeChildControl: function(control) {
		var removed = this.childControls.erase(control);
		if (removed) {
			this.willRemoveChildControl(control);
			control.willChangeView(null);
			control.setView(null);
			control.didChangeView(null);
			control.dispose();
			this.didRemoveChildControl(control);
		}
		return this;
	},

	removeFromParentView: function() {
		if (this.parentControl) this.parentControl.removeChildControl(this);
		return this;
	},

	bindChildControl: function(control) {
		this.childControls.push(control);
		control.viewWillChange(this);
		control.setParentControl(this);
		control.setView(this.view);
		control.viewDidChange(this);
		this.didBindChildControl(control);
		Object.defineMember(this, control, control.name);
		return this;
	},

	attachChildControls: function() {
		var attach = this.bound('attachChildControl');
		var filter = this.bound('filterChildControl');
		this.getElements('[data-role=control]').filter(filter).each(attach);
		return this;
	},

	attachChildControl: function(element) {
		var control = element.get('data-control');
		if (control == null) throw new Error('You have to define the control class using the data-control attribute.');
		this.bindChildControl(Class.instanciate(control, element));
		return this;
	},

	filterChildControl: function(element) {
		return element.getParent('[data-role=control]') == this.element;
	},

	destroyChildControls: function() {
		this.childControls.each(this.bound('destroyChildControl'));
		this.childControls = [];
		return this;
	},

	destroyChildControl: function(control) {
		control.destroy();
		control = null;
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

	setParentControl: function(parentControl) {
		this.parentControl = parentControl;
		return this;
	},

	getParentControl: function() {
		return this.parentControl;
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
	},

	willAddChildControl: function(childControl) {
		return this;
	},

	didAddChildControl: function(childControl) {
		return this;
	},

	didBindChildControl: function(childControl) {
		return this;
	},

	willRemoveChildControl: function(childControl) {
		return this;
	},

	didRemoveChildControl: function(childControl) {
		return this;
	}

});
