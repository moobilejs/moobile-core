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

	wrapper: null,

	options: {
		offset: {
			x: 0,
			y: 0
		}
	},

	scrollTo: function(x, y, time, relative) {
		this.scroller.scrollTo(x, y, time, relative);
		return this;
	},

	scrollToElement: function(element, time) {
		this.scroller.scrollToElement(element, time);
		return this;
	},

	getScrollSize: function() {
		return this.content.getScrollSize();
	},

	getScroll: function() {
		return this.scroller.getScroll();
	},

	willLoad: function() {

		this.parent();

		this.element.addClass('scroll-view');

		this.scroller = new Moobile.Scroller(this.content);
		this.scroller.addEvent('start', this.bound('onScrollStart'));
		this.scroller.addEvent('move', this.bound('onScrollMove'));
		this.scroller.addEvent('end', this.bound('onScrollEnd'));

		this.wrapper = this.scroller.getWrapper();
		this.wrapper.addClass('view-content-wrapper');
	},

	didBecomeReady: function() {
		this.scroller.refresh();
	},

	willHide: function() {
		this.parent();
		this.options.offset = this.scroller.getScroll();
	},

	didShow: function() {

		this.parent();

		var offset = this.options.offset;
		if (offset.x && offset.y) {
			this.scroller.scrollTo(offset.x, offset.y);
		}
	},

	destroy: function() {

		this.scroller.removeEvent('start', this.bound('onScrollStart'));
		this.scroller.removeEvent('move', this.bound('onScrollMove'));
		this.scroller.removeEvent('end', this.bound('onScrollEnd'));

		this.scroller.destroy();
		this.scroller = null;

		this.parent();
	},

	onScrollStart: function() {
		this.fireEvent('scrollstart');
	},

	onScrollMove: function() {
		this.fireEvent('scrollmove');
	},

	onScrollEnd: function() {
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
