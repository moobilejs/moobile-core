/*
---

name: List

description: Provides a control that handles a list of items.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ListRoles
	- ListStyle

provides:
	- List

...
*/

/**
 * Provides a control that handles a list of items.
 *
 * @name List
 * @class List
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.List = new Class( /** @lends List.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The selected item.
	 * @type {ListItem}
	 */
	selectedItem: null,

	/**
	 * The selected item index.
	 * @type {Number}
	 */
	selectedItemIndex: -1,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'list',
		tagName: 'ul'
	},

	/**
	 * Set the selected item.
	 * @param {ListItem} selectedItem The selected item.
	 * @return {List}
	 * @since 0.1
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
	 * Return the selected item.
	 * @return {ListItem}
	 * @since 0.1
	 */
	getSelectedItem: function() {
		return this.selectedItem;
	},

	/**
	 * Set the selected item using its index.
	 * @param {Number} index The item index.
	 * @return {ListItem}
	 * @since 0.1
	 */
	setSelectedItemIndex: function(index) {
		this.setSelectedItem(this.children[index] || null);
		return this;
	},

	/**
	 * Unselect the current selected item.
	 * @return {ListItem}
	 * @since 0.1
	 */
	clearSelectedItem: function() {
		this.setSelectedItem(null);
		return this;
	},

	/**
	 * Add an item to the list.
	 * @see Entity#addChild
	 */
	addItem: function(item, where, context) {
		return this.addChild(item, where, context);
	},

	/**
	 * Return an item of the list.
	 * @see Entity#getChild
	 */
	getItem: function(name) {
		return this.getChild(name);
	},

	/**
	 * Remove an item from the list.
	 * @see Entity#removeChild
	 */
	removeItem: function(item) {
		return this.removeChild(item);
	},

	/**
	 * Remove all items from the list
	 * @see Entity#removeChildren
	 */
	clearItems: function() {
		return this.removeChildren();
	},

	/**
	 * @see Entity#didAddChild
	 */
	didAddChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.ListItem) {
			entity.addEvent('click', this.bound('onItemClick'));
			entity.addEvent('mouseup', this.bound('onItemMouseUp'));
			entity.addEvent('mousedown', this.bound('onItemMouseDown'));
		}
	},

	/**
	 * @see Entity#didRemoveChild
	 */
	didRemoveChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.ListItem) {
			entity.removeEvent('click', this.bound('onItemClick'));
			entity.removeEvent('mouseup', this.bound('onItemMouseUp'));
			entity.removeEvent('mousedown', this.bound('onItemMouseDown'));
		}
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.selectedItem = null;
		this.selectedItemIndex = -1;
		this.parent();
	},

	/**
	 * Item click event handler.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onItemClick: function(e) {
		var item = e.target;
		if (this.selectable) this.setSelectedItem(item);
		this.fireEvent('click', e);
	},

	/**
	 * Item mouse up event handler.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onItemMouseUp: function(e) {
		var item = e.target;
		if (this.selectable && this.highlightable) item.setHighlighted(false);
		this.fireEvent('mouseup', e);
	},

	/**
	 * Item mouse down event handler.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onItemMouseDown: function(e) {
		var item = e.target;
		if (this.selectable && this.highlightable) item.setHighlighted(true);
		this.fireEvent('mousedown', e);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('list', null, function(element, name) {
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
