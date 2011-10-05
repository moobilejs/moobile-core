/*
---

name: ScrollView

description: Provides a view that scroll up or down when the content is larger 
             that the view area.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ScrollView

...
*/

(function() {

var instances = 0;

Moobile.ScrollView = new Class({

	Extends: Moobile.View,

	wrapper: null,

	scroller: null,

	defaultContentOffset: {
		x: 0,
		y: 0
	},

	getWrapper: function() {
		return this.wrapper;
	},

	getScroller: function() {
		return this.scroller;
	},

	getContentSize: function() {
		return this.content.getScrollSize();
	},

	getContentOffset: function() {
		return this.scroller.getOffset();
	},

	build: function(element) {

		this.parent(element);

		var wrapper = this.getElement('[data-role=wrapper]');
		if (wrapper == null) {
			wrapper = new Element('div[data-role=wrapper]');
			wrapper.wraps(this.content);
		}

		this.wrapper = wrapper;

		if (this.options.className) {
			this.element.addClass('scroll-' + this.options.className);
			this.wrapper.addClass('scroll-' + this.options.className + '-wrapper');
		}

		return this;
	},

	setup: function() {
		this.parent();
		this.scroller = new Moobile.Scroller(this.wrapper, this.content);
		return this;
	},

	teardown: function() {
		this.scroller.destroy();
		this.scroller = null;
		this.wrapper = null;
		this.parent();
		return this;
	},

	attachEvents: function() {
		if (++instances == 1) document.addEventListener('touchmove', this.onDocumentTouchMove);
		this.scroller.addEvent('scrollstart', this.bound('onViewScrollStart'));
		this.scroller.addEvent('scrollmove', this.bound('onViewScrollMove'));
		this.scroller.addEvent('scrollend', this.bound('onViewScrollEnd'));
		this.scroller.addEvent('refresh', this.bound('onViewScrollRefresh'));
		this.parent();
		return this;
	},

	detachEvents: function() {
		if (--instances == 0) document.removeEventListener('touchmove', this.onDocumentTouchMove);
		this.scroller.removeEvent('scrollstart', this.bound('onViewScrollStart'));
		this.scroller.removeEvent('scrollmove', this.bound('onViewScrollMove'));
		this.scroller.removeEvent('scrollend', this.bound('onViewScrollEnd'));
		this.scroller.removeEvent('refresh', this.bound('onViewScrollRefresh'));
		this.parent();
		return this;
	},

	scrollTo: function(x, y, time, relative) {
		this.scroller.scrollTo(x, y, time, relative);
		return this;
	},

	scrollToElement: function(element, time) {
		this.scroller.scrollToElement(element, time);
		return this;
	},

	scrollToPage: function (pageX, pageY, time) {
		this.scroller.scrollToPage(pageX, pageY, time);
		return this;
	},

	didShow: function() {
		this.scroller.enable();
		this.scroller.scrollTo(this.defaultContentOffset.x, this.defaultContentOffset.y);
		this.parent();
		return this;
	},

	willHide: function() {
		this.defaultContentOffset = this.scroller.getOffset();
		this.scroller.disable();
		this.parent();
		return this;
	},

	onViewScrollRefresh: function() {
		this.fireEvent('scrollrefresh');
		return this;
	},

	onViewScrollStart: function() {
		this.fireEvent('scrollstart');
		return this;
	},

	onViewScrollMove: function() {
		this.fireEvent('scrollmove');
		return this;
	},

	onViewScrollEnd: function() {
		this.fireEvent('scrollend');
		return this;
	}

});

})();