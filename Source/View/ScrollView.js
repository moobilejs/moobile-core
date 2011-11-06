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
	- ScrollViewRoles

provides:
	- ScrollView

...
*/

Moobile.ScrollView = new Class({

	Extends: Moobile.View,

	wrapper: null,

	scroller: null,

	defaultContentOffset: {
		x: 0,
		y: 0
	},

	setup: function() {

		this.parent();

		this.wrapper = new Element('div');
		this.wrapper.wraps(this.content);

		if (this.options.className) {
			this.element.addClass('scroll-' + this.options.className);
			this.wrapper.addClass('scroll-' + this.options.className + '-wrapper');
		}
		
		this.scroller = new Moobile.Scroller(this.wrapper, this.content);
	},

	teardown: function() {
		this.parent();
		this.scroller.destroy();
		this.scroller = null;
		this.wrapper = null;
	},

	attachEvents: function() {
		this.parent();
		this.scroller.addEvent('scrollstart', this.bound('onViewScrollStart'));
		this.scroller.addEvent('scrollmove', this.bound('onViewScrollMove'));
		this.scroller.addEvent('scrollend', this.bound('onViewScrollEnd'));
		this.scroller.addEvent('refresh', this.bound('onViewScrollRefresh'));
	},

	detachEvents: function() {
		this.scroller.removeEvent('scrollstart', this.bound('onViewScrollStart'));
		this.scroller.removeEvent('scrollmove', this.bound('onViewScrollMove'));
		this.scroller.removeEvent('scrollend', this.bound('onViewScrollEnd'));
		this.scroller.removeEvent('refresh', this.bound('onViewScrollRefresh'));
		this.parent();
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

	didBecomeReady: function() {
		this.scroller.refresh();
	},

	didShow: function() {
		this.parent();
		this.scroller.enable();
		this.scroller.scrollTo(this.defaultContentOffset.x, this.defaultContentOffset.y);
	},

	willHide: function() {
		this.parent();
		this.defaultContentOffset = this.scroller.getOffset();
		this.scroller.disable();
	},

	onViewScrollRefresh: function() {
		this.fireEvent('scrollrefresh');
	},

	onViewScrollStart: function() {
		this.fireEvent('scrollstart');
	},

	onViewScrollMove: function() {
		this.fireEvent('scrollmove');
	},

	onViewScrollEnd: function() {
		this.fireEvent('scrollend');
	}

});
