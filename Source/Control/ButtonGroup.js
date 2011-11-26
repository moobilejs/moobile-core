/*
---

name: ButtonGroup

description: Provides a control that groups button.

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

/**
 * Provides a control that groups button.
 *
 * @name ButtonGroup
 * @class ButtonGroup
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ButtonGroup = new Class( /** @lends ButtonGroup.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The selected button.
	 * @type {Button}
	 */
	selectedButton: null,

	/**
	 * The selected button index.
	 * @type {Number}
	 */
	selectedButtonIndex: -1,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'button-group',
		styleName: 'horizontal',
		deselectable: false
	},

	/**
	 * Set the selected button.
	 * @param {Button} selectedButton The selected button.
	 * @return {ButtonGroup}
	 * @since 0.1
	 */
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

	/**
	 * Return the selected button.
	 * @return {Button}.
	 * @since 0.1
	 */
	getSelectedButton: function() {
		return this.selectedButton;
	},

	/**
	 * Set the selected button using its index.
	 * @param {Number} index The button index.
	 * @return {ButtonGroup}
	 * @since 0.1
	 */
	setSelectedButtonIndex: function(index) {
		this.setSelectedButton(this.children[index] || null);
		return this;
	},

	/**
	 * Return the selected button index.
	 * @return {Number} The selected button index.
	 * @since 0.1
	 */
	getSelectedButtonIndex: function() {
		return this.selectedButtonIndex;
	},

	/**
	 * Add a button to the button group.
	 * @see Entity#addChild
	 */
	addButton: function(button, where, context) {
		return this.addChild(button, where, context);
	},

	/**
	 * Return a button of the button group.
	 * @see Entity#getChild
	 */
	getButton: function(name) {
		return this.getChild(name);
	},

	/**
	 * Remove a button from the group.
	 * @see Entity#removeChild
	 */
	removeButton: function(button) {
		return this.removeChild(button);
	},

	/**
	 * Remove all buttons from the group.
	 * @see Entity#removeChild
	 */
	clearButtons: function() {
		return this.removeChildren();
	},

	/**
	 * @see Entity#didAddChild
	 */
	didAddChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.addEvent('click', this.bound('onButtonClick'));
			entity.addEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.addEvent('mousedown', this.bound('onButtonMouseDown'));
		}
	},

	/**
	 * @see Entity#didRemoveChild
	 */
	didRemoveChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.removeEvent('click', this.bound('onButtonClick'));
			entity.removeEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.removeEvent('mousedown', this.bound('onButtonMouseDown'));
		}
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.selectedButton = null;
		this.selectedButtonIndex = -1;
		this.parent();
	},

	/**
	 * Button click event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @private
	 */
	onButtonClick: function(e) {
		this.setSelectedButton(e.target);
		this.fireEvent('buttonClick', e.target);
	},

	/**
	 * Button mouse up event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @private
	 */
	onButtonMouseUp: function(e) {
		this.fireEvent('buttonMouseUp', e.target);
	},

	/**
	 * Button mouse down event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @private
	 */
	onButtonMouseDown: function(e) {
		this.fireEvent('buttonMouseDown', e.target);
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('button-group', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-button-group') || Moobile.ButtonGroup, element, null, name);
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
