/*
---

name: ScrollView

description: Provides a view that scrolls when its content is larger than the
             view area.

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

	scroller: null,

	contentWrapper: null,

	defaultContentOffset: {
		x: 0,
		y: 0
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

	getScroller: function() {
		return this.scroller;
	},

	getContentWrapper: function() {
		return this.wrapper;
	},

	getContentSize: function() {
		return this.content.getScrollSize();
	},

	getContentOffset: function() {
		return this.scroller.getOffset();
	},

	didLoad: function() {

		this.parent();

		this.element.addClass('scroll-view');

		this.contentWrapper = new Element('div.view-content-wrapper');
		this.contentWrapper.wraps(this.content);

		this.scroller = new Moobile.Scroller(this.contentWrapper, this.content);
		this.scroller.addEvent('scrollstart', this.bound('onViewScrollStart'));
		this.scroller.addEvent('scrollmove', this.bound('onViewScrollMove'));
		this.scroller.addEvent('scrollend', this.bound('onViewScrollEnd'));
		this.scroller.addEvent('refresh', this.bound('onViewScrollRefresh'));
	},

	didBecomeReady: function() {
		this.scroller.refresh();
	},

	willHide: function() {
		this.parent();
		this.defaultContentOffset = this.scroller.getOffset();
		this.scroller.disable();
	},

	didShow: function() {
		this.parent();
		this.scroller.enable();
		this.scroller.scrollTo(this.defaultContentOffset.x, this.defaultContentOffset.y);
	},

	destroy: function() {

		this.scroller.removeEvent('scrollstart', this.bound('onViewScrollStart'));
		this.scroller.removeEvent('scrollmove', this.bound('onViewScrollMove'));
		this.scroller.removeEvent('scrollend', this.bound('onViewScrollEnd'));
		this.scroller.removeEvent('refresh', this.bound('onViewScrollRefresh'));

		this.scroller.destroy();
		this.scroller = null;
		this.wrapper = null;

		this.parent();
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

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('scroll-view', null, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-scroll-view', Moobile.ScrollView);
	this.addChild(instance);
});
