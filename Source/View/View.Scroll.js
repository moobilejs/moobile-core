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

		scrollableWrapper: null,

		scrollableContent: null,

		scrollableContentSize: null,

		scroller: null,

		scrollerUpdateInterval: null,

		scrolled: null,

		build: function() {
			this.parent();

			this.addClass(this.options.className + '-scroll');

			this.scrollableWrapper = new Element('div.' + this.options.className + '-scrollable-wrapper');
			this.scrollableContent = new Element('div.' + this.options.className + '-scrollable-content');
			this.scrollableContent.adopt(this.content.childElements);
			this.scrollableWrapper.adopt(this.scrollableContent);

			this.content.grab(this.scrollableWrapper);

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
			this.scrollableContent = null;
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
			return new iScroll(this.scrollableWrapper, { desktopCompatibility: true, hScroll: true, vScroll: true });
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
				this.scrolled = this.scrollableContent.getStyle('-webkit-transform');
				this.scrolled = this.scrolled.match(/translate3d\(-*(\d+)px, -*(\d+)px, -*(\d+)px\)/);
				this.scrolled = this.scrolled[2];
				this.scroller.destroy();
				this.scroller = null;
			}
			return this;
		},

		updateScroller: function() {
			if (this.scroller) {
				if (this.scrollableContentSize != this.scrollableContent.getScrollSize().y) {
					this.scrollableContentSize  = this.scrollableContent.getScrollSize().y;
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

		adopt: function() {
			this.scrollableContent.adopt.apply(this.content, arguments);
			return this;
		},

		grab: function(element, where) {

			if (where == 'header') {
				this.content.grab(element, 'top')
				return this;
			}

			if (where == 'footer') {
				this.content.grab(element, 'bottom')
				return this;
			}

			this.scrollableContent.grab(element, where);

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