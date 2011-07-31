/*
---

name: UI.List

description: Provide a list of items.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control
	- UI.ListStyle

provides:
	- UI.List

...
*/

Moobile.UI.List = new Class({

	Extends: Moobile.UI.Control,

	selectedItems: [],

	options: {
		className: 'ui-list',
		styleName: Moobile.UI.ListStyle.Default,
		multiple: false,
		selectable: true
	},

	addItem: function(item, where, context) {
		return this.addChildControl(item, where, context);
	},

	getItem: function(name) {
		return this.getChildControl(name);
	},

	getItems: function() {
		return this.getChildControls();
	},

	removeItem: function(item) {
		return this.removeChildControl(item);
	},

	removeItems: function() {
		return this.removeChildControls();
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
		var item = this.childControls[index];
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
		this.selectedItems.erase(item);
		this.fireEvent('deselect', item);
		return this;
	},

	getSelectedItem: function() {
		return this.selectedItems.getLast();
	},

	getSelectedItems: function() {
		return this.selectedItems;
	},

	didAddChildControl: function(item) {
		item.addEvent('click', this.bound('onClick'));
		item.addEvent('mouseup', this.bound('onMouseUp'));
		item.addEvent('mousedown', this.bound('onMouseDown'));
		this.parent();
		return this;
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
