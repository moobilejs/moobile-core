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

	Static: {
		scrollers: 0
	},

	Extends: Moobile.View,

	scroller: null,

	scrollerContentHeight: null,

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
		if (++Moobile.View.Scroll.scrollers == 1) document.addEventListener('touchmove', this.onDocumentTouchMove);
		return this;
	},

	detachScroller: function() {
		if (--Moobile.View.Scroll.scrollers == 0) document.removeEventListener('touchmove', this.onDocumentTouchMove);
		return this;
	},

	createScroller: function() {
		return new iScroll(this.wrapper, { desktopCompatibility: true, hScroll: false, vScroll: true });
	},

	enableScroller: function() {
		if (this.scroller == null) {
			this.scroller = this.createScroller();
			var extent = this.getContentExtent();
			this.wrapper.setStyle('overflow', 'visible');
			this.wrapper.setStyle('height', extent.y);
			this.content.setStyle('min-height', extent.y);
			this.updateScroller.periodical(250, this);
		}
		return this;
	},

	disableScroller: function() {
		if (this.scroller) {
			this.scroller.destroy();
			this.scroller = null;
		}
		return this;
	},

	updateScroller: function() {
		if (this.scroller) {
			if (this.scrollerContentHeight != this.content.getScrollSize().y) {
				this.scrollerContentHeight = this.content.getScrollSize().y;
				this.scroller.refresh();
			}
		}
		return this;
	},

	didEnter: function() {
		this.enableScroller();
		this.updateScroller();
		return this.parent();
	},

	didLeave: function() {
		this.disableScroller();
		return this.parent();
	},

	onDocumentTouchMove: function(e) {
		e.preventDefault();
	}
   
});