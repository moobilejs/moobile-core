/*
---

name: View.Scroll

description: Provide a view that scrolls when the content is larger that the
             window.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- View.Scroll

...
*/

Moobile.View.Scroll = new Class({

	Extends: Moobile.View,

	scroller: null,

	setup: function() {
		this.parent();
		this.attachScroller();
		return this;
	},

	destroy: function() {
		this.detachScroller();
		this.parent();
		return this;
	},

	attachScroller: function() {
		this.scroller = new Moobile.Scroller(this.wrapper);
		this.scroller.setup();
		return this;
	},

	detachScroller: function() {
		this.scroller.destroy();
		this.scroller = null;
		return this;
	},

	enableScroller: function() {
		this.wrapper.setStyle('height', this.getContentAreaSize().y);
		this.scroller.enable();
		this.scroller.refresh();
		return this;
	},

	disableScroller: function() {
		this.scroller.disable();
		return this;
	},

	didEnter: function() {
		this.enableScroller();
		return this.parent();
	},

	didLeave: function() {
		this.disableScroller();
		return this.parent();
	}
   
});