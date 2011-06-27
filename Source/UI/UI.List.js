/*
---

name: UI.List

description: Provide a list of items.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control
	- UI.ListItem

provides:
	- UI.List

...
*/

Moobile.UI.List = new Class({

	Extends: Moobile.UI.Control,

	items: [],

	selectedItems: [],

	options: {
		className: 'ui-list',
		multiple: false,
		selectable: true
	},

	init: function() {
		this.attachItems();
		this.parent();
		return this;
	},

	release: function() {
		this.destroyItems();
		this.parent();
		return this;
	},

	addItem: function(item, where, context) {
		this.attachItem(item);
		this.grab(item, where, context);
		return this;
	},

	removeItem: function(item) {
		this.detachItem(item);
		item.dispose();
		return this;
	},

	removeItems: function() {
		this.items.each(this.bound('removeItem'));
		this.items = [];
		return this;
	},

	attachItems: function() {
		this.element.getElements('[data-role=list-item]').each(this.bound('attachItem'));
		return this;
	},

	attachItem: function(element) {
		var item = element instanceof Element ? new Moobile.UI.ListItem(element) : element;
		item.addEvent('click', this.bound('onClick'));
		item.addEvent('mouseup', this.bound('onMouseUp'));
		item.addEvent('mousedown', this.bound('onMouseDown'));
		this.items.push(item);
		return this;
	},

	destroyItems: function() {
		this.items.each(this.bound('destroyItem'));
		this.items = [];
		return this;
	},

	destroyItem: function(item) {
		item.destroy();
		return this;
	},

	setSelectedItem: function(item) {
		if (this.options.multiple) {
			if (item.isSelected()) {
				this.removeSelectedItem(item);
				return this
			}
		} else {
			var selectedItem = this.getSelectedItem();
			if (selectedItem) {
				this.removeSelectedItem(selectedItem);
			}
		}
		item.setSelected(true);
		this.selectedItems.push(item);
		this.fireEvent('select', item);
		return this;
	},

	setSelectedItemIndex: function(index) {
		var item = this.items[index];
		if (item) this.setSelectedItem(item);
		return this;
	},

	removeSelectedItems: function() {
		this.selectedItems.each(this.bound('removeSelectedItem'));
		this.selectedItems = [];
		return this;
	},

	removeSelectedItem: function(item) {
		item.setSelected(false);
		this.selectedItems.remove(item);
		this.fireEvent('deselect', item);
		return this;
	},

	getSelectedItem: function() {
		return this.selectedItems.getLast();
	},

	getSelectedItems: function() {
		return this.selectedItems;
	},

	onClick: function(e) {
		var item = e.target;
		if (this.options.selectable) this.setSelectedItem(item);
		this.fireEvent('click', e);
		return this;
	},

	onMouseUp: function(e) {
		var item = e.target;
		if (this.options.selectable) item.setHighlighted(false);
		this.fireEvent('mouseup', e);
		return this;
	},

	onMouseDown: function(e) {
		var item = e.target;
		if (this.options.selectable) item.setHighlighted(true);
		this.fireEvent('mousedown', e);
		return this;
	}

});
