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

	selectedButton: null,

	options: {
		className: 'ui-button-group',
		orientation: 'horizontal'
	},

	build: function() {
		this.parent();
		this.element.addClass(this.options.className + '-' + this.options.orientation);
		return this;
	},

	addButton: function(button, where, context) {
		return this.addChildControl(button, where, context);
	},

	getButton: function(name) {
		return this.getChildControl(name);
	},

	getButtons: function() {
		return this.getChildControls();
	},

	removeButton: function(button) {
		return this.removeChildControl(button);
	},

	removeButtons: function() {
		return this.removeChildControls();
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
		var button = this.childControls[index];
		if (button) this.setSelectedButton(button);
		return this;
	},

	getSelectedButton: function() {
		return this.selectedButton;
	},

	didAddChildControl: function(button) {
		button.addEvent('click', this.bound('onButtonClick'));
		this.parent();
		return this;
	},

	onButtonClick: function(e) {
		this.setSelectedButton(e.target);
		return this;
	}

});