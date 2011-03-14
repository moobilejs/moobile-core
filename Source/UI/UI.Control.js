/*
---

name: UI.Control

description: Provides base events for the UI control object.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- UI.Control

...
*/

Class.refactor(UI.Control, {

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