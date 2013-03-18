"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var ButtonGroup = moobile.ButtonGroup = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__selectedButton: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__selectedButtonIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	options: {
		layout: 'horizontal',
		selectable: true,
		selectedButtonIndex: -1,
		buttons: null,
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('button-group');

		var layout = this.options.layout;
		if (layout) {
			this.addClass('button-group-layout-' + layout);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		this.setSelectable(this.options.selectable);
		this.setSelectedButtonIndex(this.options.selectedButtonIndex);

		var buttons = this.options.buttons;
		if (buttons) this.addButtons(buttons);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.__selectedButton = null;
		this.__selectedButtonIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#setSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setSelectedButton: function(selectedButton) {

		if (this.__selectable === false)
			return this;

		if (this.__selectedButton === selectedButton)
			return this;

		if (this.__selectedButton) {
			this.__selectedButton.setSelected(false);
			this.fireEvent('deselect', this.__selectedButton);
			this.__selectedButton = null;
		}

		this.__selectedButtonIndex = selectedButton ? this.getChildComponentIndex(selectedButton) : -1;

		if (selectedButton) {
			this.__selectedButton = selectedButton;
			this.__selectedButton.setSelected(true);
			this.fireEvent('select', this.__selectedButton);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#getSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedButton: function() {
		return this.__selectedButton;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#setSelectedButtonIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedButtonIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentByTypeAt(Button, index);
		}

		return this.setSelectedButton(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#getSelectedButtonIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedButtonIndex: function() {
		return this.__selectedButtonIndex;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#clearSelectedButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	clearSelectedButton: function() {
		this.setSelectedButton(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButton: function(button, where) {
		return this.addChildComponent(Button.from(button), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButtonAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonAfter: function(button, after) {
		return this.addChildComponentAfter(Button.from(button), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButtonBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonBefore: function(button, before) {
		return this.addChildComponentBefore(Button.from(button), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtons: function(buttons, where) {
		return this.addChildComponents(buttons.map(function(button) {
			return Button.from(button);
		}), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButtonsAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtonsAfter: function(buttons, after) {
		return this.addChildComponentsAfter(buttons.map(function(button) {
			return Button.from(button);
		}), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#addButtonsBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtonsBefore: function(buttons, before) {
		return this.addChildComponentsBefore(buttons.map(function(button) {
			return Button.from(button);
		}), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#getButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButtons: function() {
		return this.getChildComponentsByType(Button);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButton: function(name) {
		return this.getChildComponentByType(Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#getButtonAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentByTypeAt(Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponentsByType(Button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#setSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	setSelectable: function(selectable) {
		this.__selectable = selectable;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ButtonGroup#isSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	isSelectable: function() {
		return this.__selectable;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		if (this.__selectedButton === component) {
			this.clearSelectedButton();
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Button) {
			child.addEvent('tap', this.bound('onButtonTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Button) {
			child.removeEvent('tap', this.bound('onButtonTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	didChangeState: function(state) {
		this.parent(state)
		if (state === 'disabled' || state == null) {
			this.getChildComponents().invoke('setDisabled', state);
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	onButtonTap: function(e, sender) {
		this.setSelectedButton(sender);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('button-group', null, function(element) {
	this.addChildComponent(moobile.Component.create(ButtonGroup, element, 'data-button-group'));
});

