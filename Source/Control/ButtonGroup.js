/*
---

name: ButtonGroup

description: Provides a wrapper for many Button controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ButtonGroupRoles
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
		deselectable: false
	},

	setSelectedButton: function(selectedButton) {
		
		if (this.selectedButton === selectedButton) {
			if (selectedButton && this.options.deselectable) {
				selectedButton = null;
			} else {
				return this;
			}
		}

		if (this.selectedButton) {		
			this.fireEvent('deselect', this.selectedButton);
			this.selectedButton.setSelected(false);
			this.selectedButton = null;
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
		return this.addChild(button, where, context);
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

/**
 * @role button-group
 */
Moobile.Entity.defineRole('button-group', null, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-button-group') || Moobile.ButtonGroup, element, options, name);
	if (instance instanceof Moobile.ButtonGroup) {
		this.addChild(instance);
	}
	
	return instance;	
});