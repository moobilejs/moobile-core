/*
---

name: UI.ButtonGroup

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control

provides:
	- UI.ButtonGroup

...
*/

Moobile.UI.ButtonGroup = new Class({

	Extends: Moobile.UI.Control,

	buttons: [],

	selectedButton: null,

	options: {
		className: 'ui-button-group',
		orientation: 'horizontal',
		defaultButtonIndex: -1
	},

	build: function() {
		this.parent();
		this.element.addClass(this.options.className + '-' + this.options.orientation);
		return this;
	},

	init: function() {
		this.attachButtons();
		if (this.options.defaultButtonIndex > -1) this.setSelectedButtonIndex(this.options.defaultButtonIndex);
		this.parent();
		return this;
	},

	release: function() {
		this.buttons = null;
		this.parent();
		return this;
	},

	attachButtons: function() {
		this.element.getElements('[data-role=control]').each(this.attachButton.bind(this));
		return this;
	},

	attachButton: function(element) {
		var button = Class.instanciate(element.getProperty('data-control') || 'Moobile.UI.Button', element);
		this.buttons.push(button);
		return this;
	},

	attachEvents: function() {
		this.buttons.each(function(button) { button.addEvent('click', this.bound('onButtonClick')); }, this);
		this.parent();
		return this;
	},

	detachEvents: function() {
		this.buttons.each(function(button) { button.removeEvent('click', this.bound('onButtonClick')); }, this);
		this.parent();
		return this;
	},

	setSelectedButton: function(button) {
		if (this.selectedButton != button) {
			if (this.selectedButton) {
				this.selectedButton.setSelected(false);
				this.selectedButton = null;
			}
			this.selectedButton = button;
			this.selectedButton.setSelected(true);
			this.fireEvent('change', this.selectedButton);
		}
		return this;
	},

	setSelectedButtonIndex: function(index) {
		var button = this.buttons[index];
		if (button) this.setSelectedButton(button);
		return this;
	},

	onButtonClick: function(e) {
		this.setSelectedButton(e.target);
		return this;
	}

});