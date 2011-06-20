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

Moobile.UI.Button = new Class({

	Extends: Moobile.UI.Control,

	content: null,

	options: {
		className: 'ui-button',
		styleName: Moobile.UI.ButtonStyle.Default
	},

	setup: function() {
		this.parent();
		this.injectContent();
		return this;
	},

	teardown: function() {
		this.destroyContent();
		this.parent();
		return this;
	},

	injectContent: function() {
		if (this.isNative() == false) {
			this.content = new Element('div.' + this.options.className + '-content').adopt(this.element.getContents());
			this.element.empty();
			this.element.adopt(this.content);
		}
		return this;
	},

	destroyContent: function() {
		if (this.isNative() == false) {
			this.content.destroy();
			this.content = null;
		}
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

	setText: function(text) {
		if (this.isNative()) {
			this.element.set('value', text);
		} else {
			this.content.set('html', text);
		}
		return this;
	},

	onClick: function(e) {
		e.target = this;
		this.fireEvent('click', e);
		return this;
	},

	onMouseDown: function(e) {
		e.target = this;
		this.element.addClass(this.options.className + '-down');
		this.fireEvent('mousedown', e);
		return this;
	},

	onMouseUp: function(e) {
		e.target = this;
		this.element.removeClass(this.options.className + '-down');
		this.fireEvent('mouseup', e);
		return this;
	}

});