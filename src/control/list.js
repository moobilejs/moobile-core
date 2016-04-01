"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/List
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var List = moobile.List = new Class({

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__selectable: true,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__selectedItem: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__selectedItemIndex: -1,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	options: {
		tagName: 'ul',
		selectable: true,
		selectedItemIndex: -1,
		items: null,
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
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		this.setSelectable(this.options.selectable);
		this.setSelectedItemIndex(this.options.selectedItemIndex);

		var items = this.options.items;
		if (items) this.addItems(items);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.__selectedItem = null;
		this.__selectedItemIndex = -1;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#setSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedItem: function(selectedItem) {

		if (this.__selectable == false)
			return this;

		if (this.__selectedItem === selectedItem)
			return this;

		if (this.__selectedItem) {
			this.__selectedItem.setSelected(false);
			this.fireEvent('deselect', this.__selectedItem);
			this.__selectedItem = null;
		}

		this.__selectedItemIndex = selectedItem ? this.getChildComponentIndex(selectedItem) : -1;

		if (selectedItem) {
			this.__selectedItem = selectedItem;
			this.__selectedItem.setSelected(true);
			this.fireEvent('select', this.__selectedItem);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedItem: function() {
		return this.__selectedItem;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#setSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectedItemIndex: function(index) {

		var child = null;
		if (index >= 0) {
			child = this.getChildComponentByTypeAt(moobile.ListItem, index);
		}

		return this.setSelectedItem(child);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getSelectedItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSelectedItemIndex: function() {
		return this.__selectedItemIndex
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#clearSelectedItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	clearSelectedItem: function() {
		this.setSelectedItem(null);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItem: function(item, where) {
		return this.addChildComponent(moobile.ListItem.from(item), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItemAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItemAfter: function(item, after) {
		return this.addChildComponentAfter(moobile.ListItem.from(item), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItemBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addItemBefore: function(item, before) {
		return this.addChildComponentBefore(moobile.ListItem.from(item), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addItems: function(items, where) {
		return this.addChildComponents(items.map(function(item) {
			return moobile.ListItem.from(item);
		}), where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItemsAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addItemsAfter: function(items, after) {
		return this.addChildComponentsAfter(items.map(function(item) {
			return moobile.ListItem.from(item);
		}), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#addItemsBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addItemsBefore: function(items, before) {
		return this.addChildComponentsBefore(items.map(function(item) {
			return moobile.ListItem.from(item);
		}), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function(name) {
		return this.getChildComponentByType(moobile.ListItem, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getItemAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItemAt: function(index) {
		return this.getChildComponentByTypeAt(moobile.ListItem, index)
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getItemIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItemIndex: function(item) {
		return this.getChildComponentIndex(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#getItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItems: function() {
		return this.getChildComponentsByType(moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#removeItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeItem: function(item) {
		return this.removeChildComponent(item);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/List#removeAllItems
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllItems: function() {
		return this.removeAllChildComponentsByType(moobile.ListItem);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ListItem#setSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSelectable: function(selectable) {
		this.__selectable = selectable;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/ListItem#isSelectable
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isSelectable: function() {
		return this.__selectable;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(component) {

		this.parent(component);

		if (component instanceof moobile.ListItem) {
			component.addEvent('tapcancel', this.bound('__onItemTapCancel'));
			component.addEvent('tapstart', this.bound('__onItemTapStart'));
			component.addEvent('tapend', this.bound('__onItemTapEnd'));
			component.addEvent('tap', this.bound('__onItemTap'));
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	willRemoveChildComponent: function(component) {
		this.parent(component);
		if (this.__selectedItem === component) {
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
		if (component instanceof moobile.ListItem) {
			component.removeEvent('tapcancel', this.bound('__onItemTapCancel'));
			component.removeEvent('tapstart', this.bound('__onItemTapStart'));
			component.removeEvent('tapend', this.bound('__onItemTapEnd'));
			component.removeEvent('tap', this.bound('__onItemTap'));
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
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didUpdateLayout: function() {

		this.parent();

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

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onItemTapCancel: function(e, sender) {
		// checker plus ici
		sender.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onItemTapStart: function(e, sender) {
		if (this.__selectable && !sender.isSelected()) sender.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onItemTapEnd: function(e, sender) {
		if (this.__selectable && !sender.isSelected()) sender.setHighlighted(false);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onItemTap: function(e, sender) {
		if (this.__selectable) this.setSelectedItem(sender);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('list', null, function(element) {
	this.addChildComponent(moobile.Component.create(List, element, 'data-list'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/**
 * Grouped - iOS
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineStyle('grouped', List, {
	attach: function(element) { element.addClass('style-grouped'); },
	detach: function(element) { element.removeClass('style-grouped'); }
});
