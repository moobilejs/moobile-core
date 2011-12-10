/*
---

name: ButtonGroup

description: Provides a control that groups button.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ButtonGroup

...
*/

/**
 * @name  ButtonGroup
 * @class Provides a button group control.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends Control
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ButtonGroup = new Class( /** @lends ButtonGroup.prototype */ {

	Extends: Moobile.Control,

	/**
	 * @var    {Button} The selected button.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	selectedButton: null,

	/**
	 * @var    {Number} The selected button index.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	selectedButtonIndex: -1,

	/**
	 * @var    {Object} The class options.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		styleName: 'horizontal',
		deselectable: false
	},

	/**
	 * Sets the selected button.
	 *
	 * This method will select the given button and deselect the current
	 * selected button if any. You can also clear the selected button by
	 * passing `null` as parameter.
	 *
	 * @param {Button} selectedButton The selected button or `null` to clear
	 *                                the selection.
	 *
	 * @return {ButtonGroup} This button group.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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
	 * Returns the selected button.
	 *
	 * @return {Button} The selected button or `null` if no buttons were
	 *                  selected.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedButton: function() {
		return this.selectedButton;
	},

	/**
	 * Sets the selected button index.
	 *
	 * This method will select a button using its index, 0 being the first
	 * button in the list. Passing an index that matches no buttons will
	 * clear the selection.
	 *
	 * @param {Number} index The selected button index.
	 *
	 * @return {ButtonGroup} This button group.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedButtonIndex: function(index) {
		this.setSelectedButton(this.children[index] || null);
		return this;
	},

	/**
	 * Returns the selected button index.
	 *
	 * @return {Number} The selected button index or `-1` if no buttons were
	 *                  selected.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedButtonIndex: function() {
		return this.selectedButtonIndex;
	},

	/**
	 * Clear the selected button.
	 *
	 * @return {ButtonGroup} This button group.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	clearSelectedButton: function() {
		this.setSelectedButton(null);
		return this;
	},

	/**
	 * Adds a button.
	 *
	 * @see Entity#addChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButton: function(button, where, context) {
		return this.addChild(button, where, context);
	},

	/**
	 * Returns a button.
	 *
	 * @see Entity#getChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButton: function(name) {
		return this.getChild(name);
	},

	/**
	 * Removes a button.
	 *
	 * @see Entity#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeButton: function(button) {
		return this.removeChild(button);
	},

	/**
	 * Removes all buttons.
	 *
	 * @see Entity#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllButtons: function() {
		return this.removeChildren();
	},

	destroy: function() {
		this.selectedButton = null;
		this.selectedButtonIndex = -1;
		this.parent();
	},

	didLoad: function() {
		this.parent();
		this.element.addClass('button-group');
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
		this.fireEvent('buttonclick', e.target);
	},

	onButtonMouseUp: function(e) {
		this.fireEvent('buttonmouseup', e.target);
	},

	onButtonMouseDown: function(e) {
		this.fireEvent('buttonmousedown', e.target);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('button-group', null, function(element) {

	var type = Moobile.ButtonGroup;

	if (this.owner instanceof Moobile.BarItem || 
		this.owner instanceof Moobile.Bar) {
		type = Moobile.BarButtonGroup;
	}

	var instance = Moobile.Entity.fromElement(element, 'data-button-group', Moobile.ButtonGroup);

	this.addChild(instance);
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
