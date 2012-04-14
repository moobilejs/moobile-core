/*
---

name: List

description: Provides a control that handles a list of items.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- List

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/Control/List
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.List = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_selectable: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_selectedItem: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_selectedItemIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		tagName: 'ul'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('list');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._selectedItem = null;
		this._selectedItemIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#setSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSelectedItem: function(selectedItem) {

		if (this._selectable == false)
			return this;

		if (this._selectedItem === selectedItem)
			return this;

		if (this._selectedItem) {
			this._selectedItem.setSelected(false);
			this._selectedItem = null;
			this.fireEvent('deselect', this._selectedItem);
		}

		if (selectedItem) {
			this._selectedItem = selectedItem;
			this._selectedItem.setSelected(true);
			this.fireEvent('select', this._selectedItem);
		}

		this._selectedItemIndex = selectedItem ? this.getChildComponentIndex(selectedItem) : -1;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSelectedItem: function() {
		return this._selectedItem;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#setSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSelectedItemIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentOfTypeAt(Moobile.ListItem, index);
		}

		return this.setSelectedItem(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSelectedItemIndex: function() {
		return this._selectedItemIndex
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#clearSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	clearSelectedItem: function() {
		this.setSelectedItem(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#addItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addItem: function(item, where) {
		return this.addChildComponent(item, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#addItemAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addItemAfter: function(item, after) {
		return this.addChildComponentAfter(item, after);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#addItemBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addItemBefore: function(item, before) {
		return this.addChildComponentBefore(item, before);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItem: function(name) {
		return this.getChildComponentOfType(Moobile.ListItem, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getItemAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItemAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.ListItem, index)
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItemIndex: function(item) {
		return this.getChildComponentIndex(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#getItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItems: function() {
		return this.getChildComponentsOfType(Moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#removeItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeItem: function(item) {
		return this.removeChildComponent(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/List#removeAllItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllItems: function() {
		return this.removeAllChildComponentsOfType(Moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ListItem#setSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectable: function(selectable) {
		this._selectable = selectable;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/ListItem#isSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelectable: function() {
		return this._selectable;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChildComponent: function(component) {
		this.parent(component);
		if (component instanceof Moobile.ListItem) {
			component.addEvent('tapstart', this.bound('_onItemTapStart'));
			component.addEvent('tapend', this.bound('_onItemTapEnd'));
			component.addEvent('tap', this.bound('_onItemTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChildComponent: function(component) {
		this.parent(component);
		if (component instanceof Moobile.ListItem) {
			component.removeEvent('tapstart', this.bound('_onItemTapStart'));
			component.removeEvent('tapend', this.bound('_onItemTapEnd'));
			component.removeEvent('tap', this.bound('_onItemTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
	 */
	_onItemTapStart: function(e, sender) {
		if (this._selectable && !sender.isSelected()) sender.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onItemTapEnd: function(e, sender) {
		if (this._selectable && !sender.isSelected()) sender.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onItemTap: function(e, sender) {
		if (this._selectable) this.setSelectedItem(sender);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('list', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.List, element, 'data-list'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('grouped', Moobile.List, {
	attach: function(element) { element.addClass('style-grouped'); },
	detach: function(element) { element.removeClass('style-grouped'); }
});
