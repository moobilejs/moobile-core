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


Moobile.List = new Class( /** @lends List.prototype */ {

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
	selectedItem: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	selectedItemIndex: -1,

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		tagName: 'ul'
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('list');
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._selectedItem = null;
		this._selectedItemIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#setSelectedItem
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

		this._selectedItemIndex = selectedItem ? this.getChildIndex(selectedItem) : -1;

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#getSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSelectedItem: function() {
		return this._selectedItem;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#setSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSelectedItemIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildOfTypeAt(Moobile.ListItem, index);
		}

		return this.setSelectedItem(child);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#getSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSelectedItemIndex: function() {
		return this._selectedItemIndex
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#clearSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	clearSelectedItem: function() {
		this.setSelectedItem(null);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#addItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addItem: function(item, where) {
		return this.addChild(item, where);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#addItemAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addItemAfter: function(item, after) {
		return this.addChildAfter(item, after);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#addItemBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addItemBefore: function(item, before) {
		return this.addChildBefore(item, before);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#getItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItem: function(name) {
		return this.getChildOfType(Moobile.ListItem, name);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#getItemAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItemAt: function(index) {
		return this.getChildOfTypeAt(Moobile.ListItem, index)
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#getItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItemIndex: function(item) {
		return this.getChildIndex(item);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#getItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getItems: function() {
		return this.getChildrenOfType(Moobile.ListItem);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#removeItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeItem: function(item) {
		return this.removeChild(item);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/List#removeAllItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllItems: function() {
		return this.removeChildrenOfType(Moobile.ListItem);
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
	 * @see    http://moobile.net/api/0.1/Control/ListItem#isSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelectable: function() {
		return this._selectable;
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChild: function(component) {
		this.parent(component);
		if (component instanceof Moobile.ListItem) {
			component.addEvent('tapstart', this.bound('onItemTapStart'));
			component.addEvent('tapend', this.bound('onItemTapEnd'));
			component.addEvent('tap', this.bound('onItemTap'));
		}
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChild: function(component) {
		this.parent(component);
		if (component instanceof Moobile.ListItem) {
			component.removeEvent('tapstart', this.bound('onItemTapStart'));
			component.removeEvent('tapend', this.bound('onItemTapEnd'));
			component.removeEvent('tap', this.bound('onItemTap'));
		}
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didChangeState: function(state) {
		this.parent(state)
		if (state === 'disabled' ||
			state == null) {
			this.getChildren().invoke('setDisabled', state);
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onItemTapStart: function(e, sender) {
		if (this._selectable) sender.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onItemTapEnd: function(e, sender) {
		if (this._selectable) sender.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
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
