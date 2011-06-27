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

	content: null,

	options: {
		className: 'ui-list-item'
	},

	init: function() {
		this.injectContent();
		this.parent();
		return this;
	},

	release: function() {
		this.destroyContent();
		this.parent();
		return this;
	},

	injectContent: function() {
		this.content = new Element('div.' + this.options.className + '-content');
		this.content.adopt(this.element.getContents());
		this.element.adopt(this.content);
		return this;
	},

	destroyContent: function() {
		this.content.destroy();
		this.content = null;
		return this;
	},

	attachEvents: function() {
		this.element.addEvent('swipe', this.bound('onSwipe'));
		this.element.addEvent('click', this.bound('onClick'));
		this.element.addEvent('mouseup', this.bound('onMouseUp'))
		this.element.addEvent('mousedown', this.bound('onMouseDown'));
		this.parent();
		return this;
	},

	detachEvents: function() {
		this.element.removeEvent('swipe', this.bound('onSwipe'));
		this.element.removeEvent('click', this.bound('onClick'));
		this.element.removeEvent('mouseup', this.bound('onMouseUp'));
		this.element.removeEvent('mousedown', this.bound('onMouseDown'));
		this.parent();
		return this;
	},

	onSwipe: function(e) {
		e.target = this;
		this.fireEvent('swipe', e);
		return this;
	},

	onClick: function(e) {
		e.target = this;
		this.fireEvent('click', e);
		return this;
	},

	onMouseUp: function(e) {
		e.target = this;
		this.fireEvent('mouseup', e);
		return this;
	},

	onMouseDown: function(e) {
		e.target = this;
		this.fireEvent('mousedown', e);
		return this;
	}
});