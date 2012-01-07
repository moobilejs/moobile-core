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

	/**
	 * @var    {ListItem} The selected item.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	selectedItem: null,

	/**
	 * @var    {Number} The selected item index.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	selectedItemIndex: -1,

	/**
	 * @var    {Object} The class options.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'ul'
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

		if (selectedItem && selectedItem.isSelectable() == false)
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

		this.selectedItemIndex = selectedItem ? this.children.indexOf(selectedItem) : -1;

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
		this.setSelectedItem(this.children[index] || null);
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
	 * @see Entity#addChild
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
	 * @see Entity#getChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function(name) {
		return this.getChild(name);
	},

	/**
	 * Removes an item.
	 *
	 * @see Entity#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeItem: function(item) {
		return this.removeChild(item);
	},

	/**
	 * Removes all buttons.
	 *
	 * @see Entity#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllItems: function() {
		return this.removeChildren();
	},

	didBuild: function() {
		this.parent();
		this.element.addClass('list');
	},

	didAddChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.ListItem) {
			entity.addEvent('click', this.bound('onItemClick'));
			entity.addEvent('mouseup', this.bound('onItemMouseUp'));
			entity.addEvent('mousedown', this.bound('onItemMouseDown'));
		}
	},

	didRemoveChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.ListItem) {
			entity.removeEvent('click', this.bound('onItemClick'));
			entity.removeEvent('mouseup', this.bound('onItemMouseUp'));
			entity.removeEvent('mousedown', this.bound('onItemMouseDown'));
		}
	},

	onItemClick: function(e) {
		var item = e.target;
		if (this.selectable) this.setSelectedItem(item);
		this.fireEvent('click', e);
	},

	onItemMouseUp: function(e) {
		var item = e.target;
		if (this.selectable && this.highlightable) item.setHighlighted(false);
		this.fireEvent('mouseup', e);
	},

	onItemMouseDown: function(e) {
		var item = e.target;
		if (this.selectable && this.highlightable) item.setHighlighted(true);
		this.fireEvent('mousedown', e);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('list', null, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-list', Moobile.List);
	this.addChild(instance);
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('grouped', Moobile.List, {
	attach: function(element) { element.addClass('style-grouped'); },
	detach: function(element) { element.removeClass('style-grouped'); }
});
