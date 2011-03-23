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

	value: false,

	wrapper: null,

	caption: null,

	options: {
		className: 'ui-button',
		styleName: 'ui-button-normal'
	},

	setup: function() {
		if (this.isNative() == false) {
			this.injectWrapper();
			this.injectCaption();
		}
		return this.parent();
	},

	destroy: function() {
		if (this.isNative() == false) {
			this.destroyCaption();
			this.destroyWrapper();
		}
		return this.parent();
	},

	injectWrapper: function() {
		this.wrapper = new Element('div.' + this.options.className + '-wrapper').set('html', this.element.get('html'));
		this.element.empty();
		this.element.adopt(this.wrapper);
		return this;
	},

	destroyWrapper: function() {
		this.wrapper.destroy();
		this.wrapper = null;
		return this;
	},

	injectCaption: function() {
		this.caption = new Element('div.' + this.options.className + '-caption').set('html', this.wrapper.get('html'));
		this.wrapper.empty();
		this.wrapper.adopt(this.caption);
		return this;
	},

	destroyCaption: function() {
		this.caption.destroy();
		this.caption = null;
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
		if (this.isNative() == false) {
			this.caption.set('html', text);
		} else {
			this.element.set('value', text);
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