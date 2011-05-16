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

	initialize: function(element, options) {
		this.parent(element, options);
		this.selectable = this.options.selectable;
		return this;
	},

	setup: function() {
		this.injectWrapper();
		return this.parent();
	},

	destroy: function() {
		this.injectWrapper();
		return this.parent();
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
		this.element.addEvent(Event.CLICK, this.bound('onClick'));
		this.element.addEvent(Event.MOUSE_UP, this.bound('onMouseUp'))
		this.element.addEvent(Event.MOUSE_DOWN, this.bound('onMouseDown'));
		return this.parent();
	},

	detachEvents: function() {
		this.element.removeEvent(Event.CLICK, this.bound('onClick'));
		this.element.removeEvent(Event.MOUSE_UP, this.bound('onMouseUp'));
		this.element.removeEvent(Event.MOUSE_DOWN, this.bound('onMouseDown'));
		return this.parent();
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
				this.fireEvent(Event.SELECT, this);
			} else {
				this.removeClass(this.options.className + '-selected');
				this.fireEvent(Event.DESELECT, this);
			}			
		}
		return this;
	},

	isSelected: function() {
		return this.selected;
	},

	onClick: function(e) {
		e.target = this;
		this.fireEvent(Event.CLICK, e);
		if (this.options.selectable) this.toggleSelected();
		return this;
	},

	onMouseDown: function(e) {
		e.target = this;
		this.fireEvent(Event.MOUSE_DOWN, e);		
		if (this.options.selectable) this.element.addClass(this.options.className + '-down');
		return this;
	},

	onMouseUp: function(e) {
		e.target = this;
		this.fireEvent(Event.MOUSE_UP, e);		
		if (this.options.selectable) this.element.removeClass(this.options.className + '-down');
		return this;
	}

});