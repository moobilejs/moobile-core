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
 * @name  List
 * @class Provides a list control.
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
Moobile.List = new Class( /** @lends List.prototype */ {

	Extends: Moobile.Control,

	_selectable: true,

	/**
	 * The selected item.
	 * @type   ListItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	selectedItem: null,

	/**
	 * The selected item index.
	 * @type   Number
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	selectedItemIndex: -1,

	/**
	 * The class options.
	 * @type   Object
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'ul'
	},

	willBuild: function() {
		this.parent();
		this.element.addClass('list');
	},

	destroy: function() {
		this.selectedItem = null;
		this.selectedItemIndex = -1;
		this.parent();
	},

	/**
	 * Sets the selected item.
	 *
	 * This method will select the given item and deselect the current selected
	 * item if any. You can also clear the selected item by passing `null` as
	 * parameter.
	 *
	 * @param {ListItem} selectedItem The selected item or `null` to clear the
	 *                                selection.
	 *
	 * @return {List} This list.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedItem: function(selectedItem) {

		if (this._selectable == false)
			return this;

		if (this.selectedItem == selectedItem)
			return this;

		if (this.selectedItem) {
			this.selectedItem.setSelected(false);
			this.selectedItem = null;
			this.fireEvent('deselect', this.selectedItem);
		}

		if (selectedItem) {
			this.selectedItem = selectedItem;
			this.selectedItem.setSelected(true);
			this.fireEvent('select', this.selectedItem);
		}

		this.selectedItemIndex = selectedItem ? this._children.indexOf(selectedItem) : -1;

		return this;
	},

	/**
	 * Returns the selected item.
	 *
	 * @return {ListItem} The selected item or `null` if no items were
	 *                    selected.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedItem: function() {
		return this.selectedItem;
	},

	/**
	 * Sets the selected item index.
	 *
	 * This method will select an item using its index, 0 being the first item
	 * in the list. Passing an index that matches no items will clear the
	 * selection.
	 *
	 * @param {Number} index The selected item index.
	 *
	 * @return {List} This list.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedItemIndex: function(index) {
		this.setSelectedItem(this._children[index] || null);
		return this;
	},

	/**
	 * Returns the selected item index.
	 *
	 * @return {Number} The selected item index or `-1` if no items were
	 *                  selected.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedItemIndex: function() {
		return this.selectedItemIndex
	},

	/**
	 * Clear the selected button.
	 *
	 * @return {List} This list.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	clearSelectedItem: function() {
		this.setSelectedItem(null);
		return this;
	},

	/**
	 * Adds an item.
	 *
	 * @see EventDispatcher#addChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItem: function(item, where, context) {
		return this.addChild(item, where, context);
	},

	/**
	 * Returns an item.
	 *
	 * @see EventDispatcher#getChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function(name) {
		return this.getChild(name);
	},

	getItems: function() {
		return this.getChildren(Moobile.ListItem);
	},

	/**
	 * Removes an item.
	 *
	 * @see EventDispatcher#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeItem: function(item) {
		return this.removeChild(item);
	},

	/**
	 * Removes all items.
	 *
	 * @see EventDispatcher#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllItems: function() {
		return this.removeChildren(Moobile.ListItem);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/ListItem#setSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectable: function(selectable) {
		this._selectable = selectable;
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/ListItem#getSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelectable: function() {
		return this._selectable;
	},

	didAddChild: function(child) {

		this.parent(child);

		if (child instanceof Moobile.ListItem) {
			child.addEvent('tapstart', this.bound('onItemTapStart'));
			child.addEvent('tapend', this.bound('onItemTapEnd'));
			child.addEvent('tap', this.bound('onItemTap'));
		}
	},

	didRemoveChild: function(child) {

		this.parent(child);

		if (child instanceof Moobile.ListItem) {
			child.removeEvent('tapstart', this.bound('onItemTapStart'));
			child.removeEvent('tapend', this.bound('onItemTapEnd'));
			child.removeEvent('tap', this.bound('onItemTap'));
		}
	},

	onItemTapStart: function(e, sender) {
		if (this._selectable) sender.setHighlighted(true);
	},

	onItemTapEnd: function(e, sender) {
		if (this._selectable) sender.setHighlighted(false);
	},

	onItemTap: function(e, sender) {
		if (this._selectable) this.setSelectedItem(sender);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('list', null, function(element) {
	var instance = Moobile.Component.create(Moobile.List, element, 'data-list');
	this.addChild(instance);
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('grouped', Moobile.List, {
	attach: function(element) { element.addClass('style-grouped'); },
	detach: function(element) { element.removeClass('style-grouped'); }
});
