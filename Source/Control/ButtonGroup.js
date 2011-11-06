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
		styleName: 'horizontal',
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

		this.selectedButtonIndex = selectedButton ? this.children.indexOf(selectedButton) : -1;

		return this;
	},

	getSelectedButton: function() {
		return this.selectedButton;
	},

	setSelectedButtonIndex: function(index) {
		this.setSelectedButton(this.children[index]);
		return this;
	},

	getSelectedButtonIndex: function(index) {
		return this.selectedButtonIndex;
	},

	addButton: function(button, where, context) {
		return this.addChild(button, where, context);
	},

	getButton: function(name) {
		return this.getChild(name);
	},

	removeButton: function(button) {
		return this.removeChild(button);
	},

	clearButtons: function() {
		return this.removeChildViews();
	},

	didAddChild: function(entity) {

		this.parent(entity);
		
		if (entity instanceof Moobile.Button) {
			entity.addEvent('click', this.bound('onButtonClick'));
			entity.addEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.addEvent('mousedown', this.bound('onButtonMouseDown'));
		}
	},

	didRemoveChild: function(entity) {
		
		this.parent(entity);
		
		if (entity instanceof Moobile.Button) {
			entity.removeEvent('click', this.bound('onButtonClick'));
			entity.removeEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.removeEvent('mousedown', this.bound('onButtonMouseDown'));
		}	
	},

	onButtonClick: function(e) {
		this.setSelectedButton(e.target);
		this.fireEvent('buttonClick', e.target);
	},
	
	onButtonMouseUp: function(e) {
		this.fireEvent('buttonMouseUp', e.target);
	},
	
	onButtonMouseDown: function(e) {
		this.fireEvent('buttonMouseDown', e.target);
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('button-group', null, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-button-group') || Moobile.ButtonGroup, element, options, name);
	if (instance instanceof Moobile.ButtonGroup) {
		this.addChild(instance);
	}
	
	return instance;	
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('horizontal', Moobile.ButtonGroup, {
	attach: function(element) { element.addClass('style-horizontal'); },			
	detach: function(element) { element.removeClass('style-horizontal'); }			
});

Moobile.Entity.defineStyle('vertical', Moobile.ButtonGroup, {
	attach: function(element) { element.addClass('style-vertical'); },			
	detach: function(element) { element.removeClass('style-vertical'); }			
});
