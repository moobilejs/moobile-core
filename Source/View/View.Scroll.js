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

	contentSize: null,

	scroller: null,

	scrollerUpdateInterval: null,

	scrolled: null,

	options: {
		withWrapperElement: true,
		withContentElement: true
	},

	init: function() {
		this.attachScroller();
		this.parent();
		return this;
	},

	release: function() {
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
		return new iScroll(this.wrapperElement, { desktopCompatibility: true, hScroll: false, vScroll: true });
	},

	enableScroller: function() {
		if (this.scroller == null) {
			this.scroller = this.createScroller();
			this.wrapperElement.setStyle('overflow', 'visible');
			this.updateScroller();
			this.updateScrollerAutomatically(true);
			if (this.scrolled) this.scroller.scrollTo(0, -this.scrolled);
		}
		return this;
	},

	disableScroller: function() {
		if (this.scroller) {
			this.updateScrollerAutomatically(false);
			this.scrolled = this.contentElement.getStyle('transform');
			this.scrolled = this.scrolled.match(/translate3d\(-*(\d+)px, -*(\d+)px, -*(\d+)px\)/);
			this.scrolled = this.scrolled[2];
			this.scroller.destroy();
			this.scroller = null;
		}
		return this;
	},

	updateScroller: function() {
		if (this.scroller) {
			if (this.contentSize != this.contentElement.getScrollSize().y) {
				this.contentSize = this.contentElement.getScrollSize().y;
				var extent = this.getContentExtent();
				this.wrapperElement.setStyle('height', extent.y);
				this.wrapperElement.setStyle('min-height', extent.y);
				this.contentElement.setStyle('min-height', extent.y);
				this.scroller.refresh();
			}
		}
		return this;
	},

	updateScrollerAutomatically: function(automatically) {
		clearInterval(this.scrollerUpdateInterval);
		if (automatically) this.scrollerUpdateInterval = this.updateScroller.periodical(250, this);
		return this;
	},

	getContentExtent: function() {
		var prev = this.wrapperElement.getPrevious();
		var next = this.wrapperElement.getNext();
		var size = this.getSize();
		if (prev) size.y = size.y - prev.getPosition().y - prev.getSize().y;
		if (next) size.y = size.y - next.getPosition().y;
		return size;
	},

	didShow: function() {
		this.enableScroller();
		return this;
	},

	didHide: function() {
		this.disableScroller();
		return this;
	},

	onDocumentTouchMove: function(e) {
		e.preventDefault();
	}

});