/*
---

name: List

description: Provide a List control.

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

Moobile.List = new Class({

	Extends: Moobile.Control,

	Roles: Moobile.ListRoles,

	selectedItem: null,

	selectedItemIndex: -1,

	options: {
		className: 'list',
		styleName: Moobile.ListStyle.Default
	},

	build: function() {

		this.parent();

		var content = this.content.getElement('> ul');
		if (content == null) {
			content = new Element('ul');
			content.ingest(this.content);
			content.inject(this.content);
		}

		this.content = content;

		return this;
	},

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

		this.selectedItemIndex = selectedItem ? this.childViews.indexOf(selectedItem) : -1;

		return this;
	},

	setSelectedItemIndex: function(index) {
		this.setSelectedItem(this.childViews[index] || null);
		return this;
	},

	addItem: function(item, where, context) {
		return this.addChild(item, where, context);
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
		if (this.selectable && this.highlightable) item.setHighlighted(false);
		this.fireEvent('mouseup', e);
		return this;
	},

	onItemMouseDown: function(e) {
		var item = e.target;
		if (this.selectable && this.highlightable) item.setHighlighted(true);
		this.fireEvent('mousedown', e);
		return this;
	}

});
