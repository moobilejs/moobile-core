/*
---

name: List

description: Provide a list of items.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ListStyle

provides:
	- List

...
*/

Moobile.List = new Class({

	Extends: Moobile.Control,

	selectedItem: null,

	selectedItemIndex: -1,

	options: {
		className: 'list',
		styleName: Moobile.ListStyle.Default
	},

	build: function(element) {

		this.parent(element);

		var content = this.getElement('ul');
		if (content == null) {
			content = new Element('ul');
			content.ingest(this.content);
			content.inject(this.content);
		}

		this.content = content;

		return this;
	},

	setSelectedItem: function(selectedItem) {

		if (selectedItem.isSelectable() == false)
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

		this.selectedItemIndex = selectedItem ? this.childViews.indexOf(selectedItem) : -1;

		return this;
	},

	setSelectedItemIndex: function(index) {

		var selectedItem = this.childViews[index];
		if (selectedItem) {
			this.setSelectedItem(selectedItem);
		}

		return this;
	},

	addItem: function(item, where, context) {
		return this.addChildView(item, where, context);
	},

	getItem: function(name) {
		return this.getChildView(name);
	},

	removeItem: function(item) {
		return this.removeChildView(item);
	},

	clearItems: function() {
		return this.removeChildViews();
	},

	didAddChildView: function(item) {

		this.parent(item);

		if (item instanceof Moobile.ListItem) {
			item.addEvent('click', this.bound('onItemClick'));
			item.addEvent('mouseup', this.bound('onItemMouseUp'));
			item.addEvent('mousedown', this.bound('onItemMouseDown'));
		}

		return this;
	},

	didRemoveChildView: function(item) {

		this.parent(item);

		if (item instanceof Moobile.ListItem) {
			item.removeEvent('click', this.bound('onItemClick'));
			item.removeEvent('mouseup', this.bound('onItemMouseUp'));
			item.removeEvent('mousedown', this.bound('onItemMouseDown'));
		}

		return this;
	},

	onItemClick: function(e) {
		var item = e.target;
		if (this.selectable) this.setSelectedItem(item);
		this.fireEvent('click', e);
		return this;
	},

	onItemMouseUp: function(e) {
		var item = e.target;
		if (this.selectable) item.setHighlighted(false);
		this.fireEvent('mouseup', e);
		return this;
	},

	onItemMouseDown: function(e) {
		var item = e.target;
		if (this.selectable) item.setHighlighted(true);
		this.fireEvent('mousedown', e);
		return this;
	}

});
