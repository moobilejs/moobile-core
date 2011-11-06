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

	selectedItem: null,

	selectedItemIndex: -1,

	options: {
		className: 'list',
		tagName: 'ul'
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

		this.selectedItemIndex = selectedItem ? this.children.indexOf(selectedItem) : -1;

		return this;
	},

	setSelectedItemIndex: function(index) {
		this.setSelectedItem(this.children[index] || null);
		return this;
	},

	addItem: function(item, where, context) {
		return this.addChild(item, where, context);
	},

	getItem: function(name) {
		return this.getChild(name);
	},

	removeItem: function(item) {
		return this.removeChild(item);
	},

	clearItems: function() {
		return this.removeChildren();
	},

	didAddChild: function(child) {

		this.parent(child);

		if (child instanceof Moobile.ListItem) {
			child.addEvent('click', this.bound('onItemClick'));
			child.addEvent('mouseup', this.bound('onItemMouseUp'));
			child.addEvent('mousedown', this.bound('onItemMouseDown'));
		}
	},

	didRemoveChild: function(child) {

		this.parent(child);

		if (child instanceof Moobile.ListItem) {
			child.removeEvent('click', this.bound('onItemClick'));
			child.removeEvent('mouseup', this.bound('onItemMouseUp'));
			child.removeEvent('mousedown', this.bound('onItemMouseDown'));
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
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('list', null, function(element, options, name) {

	var instance = Class.instantiate(element.get('data-list') || Moobile.List, element, options, name);
	if (instance instanceof Moobile.List) {
		this.addChild(instance);
	}
	
	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('list-item', Moobile.List, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-list-item') || Moobile.ListItem, element, options, name);
	if (instance instanceof Moobile.ListItem) {
		this.addChild(instance);
	}
	
	return instance;
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('grouped', Moobile.List, {
	attach: function(element) { element.addClass('style-grouped'); },			
	detach: function(element) { element.removeClass('style-grouped'); }
});
