/*
---

name: UI.ListItem

description: Provide an item of a list.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control

provides:
	- UI.ListItem

...
*/

Moobile.UI.ListItem = new Class({

	Extends: Moobile.UI.Control,

	wrapper: null,

	selected: false,

	options: {
		className: 'ui-list-item',
		selectable: true
	},

	setup: function() {
		this.parent();
		this.injectWrapper();
		return this;
	},

	teardown: function() {
		this.destroyWrapper();
		this.parent();
		return this;
	},

	injectWrapper: function() {
		this.wrapper = new Element('div.' + this.options.className + '-wrapper').adopt(this.element.getContents());
		this.element.empty();
		this.element.adopt(this.wrapper);
		return this;
	},

	destroyWrapper: function() {
		this.wrapper.destroy();
		this.wrapper = null;
		return this;
	},

	attachEvents: function() {
		this.element.addEvent('click', this.bound('onClick'));
		this.element.addEvent('mouseup', this.bound('onMouseUp'))
		this.element.addEvent('mousedown', this.bound('onMouseDown'));
		this.parent();
		return this;
	},

	detachEvents: function() {
		this.element.removeEvent('click', this.bound('onClick'));
		this.element.removeEvent('mouseup', this.bound('onMouseUp'));
		this.element.removeEvent('mousedown', this.bound('onMouseDown'));
		this.parent();
		return this;
	},

	setSelectable: function(selectable) {
		this.options.selectable = selectable;
	},

	toggleSelected: function() {
		return this.setSelected(!this.selected);
	},

	setSelected: function(selected) {
		if (this.selected != selected) {
			this.selected = selected;
			if (this.selected) {
				this.addClass(this.options.className + '-selected');
				this.fireEvent('select', this);
			} else {
				this.removeClass(this.options.className + '-selected');
				this.fireEvent('deselect', this);
			}
		}
		return this;
	},

	isSelected: function() {
		return this.selected;
	},

	onClick: function(e) {
		e.target = this;
		this.fireEvent('click', e);
		if (this.options.selectable) this.toggleSelected();
		return this;
	},

	onMouseDown: function(e) {
		e.target = this;
		this.fireEvent('mousedown', e);
		if (this.options.selectable) this.element.addClass(this.options.className + '-down');
		return this;
	},

	onMouseUp: function(e) {
		e.target = this;
		this.fireEvent('mouseup', e);
		if (this.options.selectable) this.element.removeClass(this.options.className + '-down');
		return this;
	}

});