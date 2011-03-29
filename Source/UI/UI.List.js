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

UI.List = new Class({

	Extends: UI.Control,

	items: [],

	selectedItems: [],

	options: {
		className: 'ui-list',
		selectable: true,
		multiple: false
	},

	setup: function() {
		this.attachItems();
		return this.parent();
	},

	destroy: function() {
		this.destroyItems();
		return this.parent();
	},

	destroyItems: function() {
		this.items.each(function(item) { item.destroy(); });
		this.items = null;
		this.items = [];
		return this;
	},

	attachItems: function() {
		this.element.getElements('[data-role=list-item]').each(this.attachItem.bind(this));
		return this;
	},

	attachItem: function(element) {
		var item = new UI.ListItem(element);
		item.setSelectable(this.options.selectable);
		item.addEvent(Event.SELECT, this.bound('onSelect'));
		item.addEvent(Event.DESELECT, this.bound('onDeselect'));
		this.items.push(item);
		return this;
	},

	detachItems: function() {
		this.item = null;
		this.item = [];
		return this;
	},

	detachItem:function(item) {
		this.item.remove(item);
		return this;
	},

	setSelectable: function(selectable) {
		this.options.selectable = selectable;
		this.items.each(function(item) { item.setSelectable(selectable) });
		return this;
	},

	setSelectedItem: function(item) {
		this.setItemAsSelected(item.setSelected(true));
		return this;
	},

	setSelectedItems: function() {
		Array.each(arguments, function(item) { this.setSelectedItem(item) }.bind(this));
		return this;
	},

	removeSelectedItem: function(item) {
		this.setItemAsDeselected(item.setSelected(false));
	},

	removeSelectedItems: function() {
		Array.each(arguments, function(item) { this.removeSelectedItem(item) }.bind(this));
		return this;
	},

	clearSelectedItems: function() {
		this.removeSelectedItems.apply(this, this.selectedItems);
	},

	setItemAsSelected: function(item) {
		if (this.options.multiple == false) {
			this.selectedItems.each(function(item) { item.setSelected(false); });
			this.selectedItems = null;
			this.selectedItems = []
		}
		this.selectedItems.push(item);
		this.fireEvent(Event.SELECT, item);
		return this;
	},

	setItemAsDeselected: function(item) {
		this.selectedItems.remove(item);
		this.fireEvent(Event.DESELECT, item);
		return this;
	},

	getSelectedItem: function() {
		return this.selectedItems.getLast();
	},

	getSelectedItems: function() {
		return this.selectedItems;
	},

	onSelect: function(item) {
		return this.setItemAsSelected(item);
	},

	onDeselect: function(item) {
		return this.setItemAsDeselected(item);
	}

});