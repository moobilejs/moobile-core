/*
---

name: UI.Button

description: Provides a button.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control

provides:
	- UI.Button
	- UI.ButtonStyle

...
*/

UI.Button = new Class({

	Extends: UI.Control,
	
	content: null,

	options: {
		className: 'ui-button',
		styleName: 'ui-button-normal'
	},

	initialize: function(element, options) {
		this.setElement(element);
		this.setOptions(options);
		this.attachContent();
		return this.parent(element, options);
	},

	destroy: function() {
		this.detachContent();
		return this.parent();
	},

	create: function() {
		return this.parent().adopt(
			new Element('span[data-role=button-content].' + this.options.className + '-content')
		);
	},

	attachContent: function() {
		this.content = this.element.getElement('[data-role=button-content]');
		return this;
	},

	detachContent: function() {
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
		if (this.content) {
			this.content.set('html', text);
		} else {
			this.value = text;
		}
		return this;
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

UI.ButtonStyle = {
	NORMAL: 'ui-button-normal'
};