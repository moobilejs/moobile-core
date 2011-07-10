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

(function() {
	
	var count = 0;
	
	Moobile.View.Scroll = new Class({

		Extends: Moobile.View,

		outerElement: null,

		innerElement: null,

		innerElementSize: null,

		scroller: null,

		scrollerUpdateInterval: null,

		scrolled: null,

		build: function() {
			this.parent();
			this.addClass(this.options.className + '-scroll');
			this.buildInnerElement();
			this.buildOuterElement();
			return this;
		},

		buildInnerElement: function() {
			this.innerElement = new Element('div.' + this.options.className + '-scroll-inner');
			this.innerElement.adopt(this.content.childElements);
			this.adopt(this.innerElement);
			return this;
		},

		buildOuterElement: function() {
			this.outerElement = new Element('div.' + this.options.className + '-scroll-outer');
			this.outerElement.adopt(this.content.childElements);
			this.adopt(this.outerElement);
			return this;
		},

		init: function() {
			this.parent();
			this.attachScroller();
			return this;
		},

		release: function() {
			this.disableScroller();
			this.detachScroller();
			this.outerElement = null;
			this.innerElement = null;
			this.parent();
			return this;
		},

		attachScroller: function() {
			if (++count == 1) document.addEventListener('touchmove', this.onDocumentTouchMove);
			return this;
		},

		detachScroller: function() {
			if (--count == 0) document.removeEventListener('touchmove', this.onDocumentTouchMove);
			return this;
		},

		createScroller: function() {
			return new iScroll(this.outerElement, { desktopCompatibility: true, hScroll: true, vScroll: true });
		},

		enableScroller: function() {
			if (this.scroller == null) {
				this.scroller = this.createScroller();
				this.updateScroller();
				this.updateScrollerAutomatically(true);
				if (this.scrolled) this.scroller.scrollTo(0, -this.scrolled);
			}
			return this;
		},

		disableScroller: function() {
			if (this.scroller) {
				this.updateScrollerAutomatically(false);
				this.scrolled = this.innerElement.getStyle('-webkit-transform');
				this.scrolled = this.scrolled.match(/translate3d\(-*(\d+)px, -*(\d+)px, -*(\d+)px\)/);
				this.scrolled = this.scrolled[2];
				this.scroller.destroy();
				this.scroller = null;
			}
			return this;
		},

		updateScroller: function() {
			if (this.scroller) {
				if (this.innerElementSize != this.innerElement.getScrollSize().y) {
					this.innerElementSize  = this.innerElement.getScrollSize().y;
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

		willShow: function() {
			this.enableScroller();
			this.parent();
			return this;
		},

		didShow: function() {
			this.updateScroller();
			this.parent();
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
	
})();