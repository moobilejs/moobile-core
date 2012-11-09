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
 * @see    http://moobilejs.com/doc/latest/Control/List
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.List = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_selectable: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_selectedItem: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_selectedItemIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'ul',
		selectable: true,
		selectedItemIndex: -1
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('list');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBuild: function() {
		this.parent();
		this.setSelectable(this.options.selectable);
		this.setSelectedItemIndex(this.options.selectedItemIndex);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this._selectedItem = null;
		this._selectedItemIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#setSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedItem: function(selectedItem) {

		if (this._selectable == false)
			return this;

		if (this._selectedItem === selectedItem)
			return this;

		if (this._selectedItem) {
			this._selectedItem.setSelected(false);
			this.fireEvent('deselect', this._selectedItem);
			this._selectedItem = null;
		}

		this._selectedItemIndex = selectedItem ? this.getChildComponentIndex(selectedItem) : -1;

		if (selectedItem) {
			this._selectedItem = selectedItem;
			this._selectedItem.setSelected(true);
			this.fireEvent('select', this._selectedItem);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedItem: function() {
		return this._selectedItem;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#setSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedItemIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentOfTypeAt(Moobile.ListItem, index);
		}

		return this.setSelectedItem(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedItemIndex: function() {
		return this._selectedItemIndex
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#clearSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	clearSelectedItem: function() {
		this.setSelectedItem(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#addItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItem: function(item, where) {
		return this.addChildComponent(Moobile.ListItem.from(item), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#addItemAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItemAfter: function(item, after) {
		return this.addChildComponentAfter(Moobile.ListItem.from(item), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#addItemBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItemBefore: function(item, before) {
		return this.addChildComponentBefore(Moobile.ListItem.from(item), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function(name) {
		return this.getChildComponentOfType(Moobile.ListItem, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getItemAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItemAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.ListItem, index)
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItemIndex: function(item) {
		return this.getChildComponentIndex(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#getItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItems: function() {
		return this.getChildComponentsOfType(Moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#removeItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeItem: function(item) {
		return this.removeChildComponent(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/List#removeAllItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllItems: function() {
		return this.removeAllChildComponentsOfType(Moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#setSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectable: function(selectable) {
		this._selectable = selectable;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#isSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelectable: function() {
		return this._selectable;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(component) {

		this.parent(component);

		if (component instanceof Moobile.ListItem) {
			component.addEvent('tapstart', this.bound('_onItemTapStart'));
			component.addEvent('tapend', this.bound('_onItemTapEnd'));
			component.addEvent('tap', this.bound('_onItemTap'));
		}

		var components = this.getChildComponents();
		for (var i = 0; i < components.length; i++) {
			var prev = components[i - 1];
			var next = components[i + 1];
			var curr = components[i];
			if (curr.hasStyle('header')) {
				if (next) next.addClass('list-section-header');
				if (prev) prev.addClass('list-section-footer');
			} else {
				if (next && next.hasStyle('header') ||
					prev && prev.hasStyle('header')) {
					continue;
				}
				curr.removeClass('list-section-header');
				curr.removeClass('list-section-footer');
			}
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		if (this._selectedItem === component) {
			this.clearSelectedItem();
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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
	 * @since  0.1.0
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
	_onItemTapStart: function(e, sender) {
		if (this._selectable && !sender.isSelected()) sender.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onItemTapEnd: function(e, sender) {
		if (this._selectable && !sender.isSelected()) sender.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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
