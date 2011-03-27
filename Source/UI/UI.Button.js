/*
---

name: UI.Button

description: Provides a button.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control
	- UI.ButtonStyle

provides:
	- UI.Button

...
*/

UI.Button = new Class({

	Extends: UI.Control,

	value: false,

	content: null,

	options: {
		className: 'ui-button',
		styleName: UI.ButtonStyle.NORMAL
	},

	setup: function() {
		if (this.isNative() == false) this.injectContent();
		return this.parent();
	},

	destroy: function() {
		if (this.isNative() == false) this.destroyContent();
		return this.parent();
	},

	injectContent: function() {
		this.content = new Element('div.' + this.options.className + '-content').set('html', this.element.get('html'));
		this.element.empty();
		this.element.adopt(this.content);
		return this;
	},

	destroyContent: function() {
		this.content.destroy();
		this.content = null;
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

	setText: function(text) {
		if (this.isNative()) {
			this.element.set('value', text);
		} else {
			this.content.set('html', text);
		}
		return this;
	},

	isNative: function() {
		return this.element.get('tag') == 'input';
	},

	onClick: function() {
		this.fireEvent(Event.CLICK);
		return this;
	},

	onMouseDown: function() {
		this.element.addClass(this.options.className + '-down');
		this.fireEvent(Event.MOUSE_DOWN);
		return this;
	},

	onMouseUp: function() {
		this.element.removeClass(this.options.className + '-down');
		this.fireEvent(Event.MOUSE_UP);
		return this;
	}

});