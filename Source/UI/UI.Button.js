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

...
*/

UI.Button = new Class({

	Extends: UI.Control,

	Binds: ['onClick'],

	attachEvents: function() {
		this.element.addEvent(Event.CLICK, this.onClick);
		return this.parent();
	},

	detachEvents: function() {
		this.element.removeEvent(Event.CLICK, this.onClick);
		return this.parent();
	},

	onClick: function() {
		this.fireEvent(Event.CLICK);
		return this;
	}

});