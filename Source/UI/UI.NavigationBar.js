/*
---

name: UI.NavigationBar

description: Provide the navigation bar control that contains a title and two
             areas for buttons.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Extras/UI.Control

provides:
	- UI.NavigationBar

...
*/

UI.NavigationBar = new Class({

	Extends: UI.Control,

	view: null,

	title: null,

	buttons: {},

	options: {
		className: 'ui-navigation-bar',
		styleName: 'ui-navigation-bar-normal'
	},

	initialize: function(element, options) {
		this.setElement(element);
		this.setOptions(options);
		this.attachTitle();
		return this.parent(element, options);
	},

	create: function() {
		return new Element('div').adopt(
			new Element('div[data-role=navigation-bar-title].' + this.options.className + '-title'),
			new Element('div[data-role=navigation-bar-button-left].' + this.options.className + '-button-left'),
			new Element('div[data-role=navigation-bar-button-right].' + this.options.className + '-button-right')
		);
	},

	destroy: function() {
		this.hide();
		this.detachTitle();
		return this;
	},

	attachTitle: function() {
		this.title = this.element.getElement('[data-role=navigation-bar-title]');
		return this;
	},

	detachTitle: function() {
		this.title.destroy();
		this.title = null;
		return this;
	},

	setView: function(view) {
		this.view = view;
		return this;
	},

	getView: function() {
		return this.view;
	},

	setTitle: function(title) {
		this.title.set('html', title);
		return this;
	},

	removeTitle: function() {
		this.title.set('html', '');
	},

	setButton: function(button, where) {
		var element = this.element.getElement('[data-role=navigation-bar-button-' + where + ']');
		if (element) {
			if (this.buttons[where]) {
				this.buttons[where].destroy();
				this.buttons[where] = null;
			}
			this.buttons[where] = button;
			this.buttons[where].inject(element);
		}
		return this;
	},

	setLeftButton: function(button) {
		this.setButton(button, 'left');
		return this;
	},

	setRightButton: function(button) {
		this.setButton(button, 'right');
		return this;
	},

	removeButton: function(where) {
		var button = this.buttons[where];
		if (button) {
			button.destroy();
			button = null;
		}
		delete this.buttons[where];
		return this;
	},

	removeLeftButton: function() {
		this.removeButton('left');
		return this;
	},

	removeRightButton: function() {
		this.removeButton('right');
		return this;
	},

	removeButtons: function() {
		Object.each(this.buttons, function(button) {
			if (button) {
				button.destroy();
				button = null;
			}
		});
		this.buttons = null;
		this.buttons = {};
		return this;
	},

	show: function() {
		this.parent();
		this.view.addClass(this.options.className + '-visible');
		return this;
	},

	hide: function() {
		this.parent();
		this.view.removeClass(this.options.className + '-visible');
		return this;
	}

});