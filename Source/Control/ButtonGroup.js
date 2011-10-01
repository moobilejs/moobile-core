/*
---

name: ButtonGroup

description: Provides a wrapper for many Button controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ButtonGroupStyle

provides:
	- ButtonGroup

...
*/

Moobile.ButtonGroup = new Class({

	Extends: Moobile.Control,

	selectedButton: null,

	selectedButtonIndex: -1,

	options: {
		className: 'button-group',
		styleName: Moobile.ButtonGroupStyle.Horizontal
	},

	setSelectedButton: function(selectedButton) {

		if (this.selectedButton == selectedButton)
			return this;

		if (this.selectedButton) {
			this.selectedButton.setSelected(false);
			this.selectedButton = null;
			this.fireEvent('deselect', this.selectedButton);
		}

		if (selectedButton) {
			this.selectedButton = selectedButton;
			this.selectedButton.setSelected(true);
			this.fireEvent('select', this.selectedButton);
		}

		this.selectedButtonIndex = selectedButton ? this.childViews.indexOf(selectedButton) : -1;

		return this;
	},

	getSelectedButton: function() {
		return this.selectedButton;
	},

	setSelectedButtonIndex: function(index) {
		this.setSelectedButton(this.childViews[index]);
		return this;
	},

	getSelectedButtonIndex: function(index) {
		return this.selectedButtonIndex;
	},

	addButton: function(button, where, context) {
		return this.addChildView(button, where, context);
	},

	getButton: function(name) {
		return this.getChildView(name);
	},

	removeButton: function(button) {
		return this.removeChildView(button);
	},

	clearButtons: function() {
		return this.removeChildViews();
	},

	didAddChildView: function(childView) {
		this.parent(childView);
		childView.addEvent('click', this.bound('onButtonClick'));
		return this;
	},

	didRemoveChildView: function(childView) {
		this.parent(childView);
		childView.removeEvent('click', this.bound('onButtonClick'));
		return this;
	},

	onButtonClick: function(e) {
		this.setSelectedButton(e.target);
		return this;
	}

});