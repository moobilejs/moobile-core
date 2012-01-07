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

/**
 * @name  ScrollView
 * @class Provides supports for displaying content that is larger tha this view
 *        size.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends View
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ScrollView = new Class({

	Extends: Moobile.View,

	/**
	 * @var    {Scroller} The scroller.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scroller: null,

	/**
	 * @var    {Element} The element that wraps the content and make it scrollable.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	wrapper: null,

	/**
	 * @var    {Object} The class options.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		momentum: true,
		scrollX: true,
		scrollY: true,
		snapToPage: false,
		snapToPageAt: 35,
		snapToPageDuration: 150,
		snapToPageDelay: 150,
		offset: {
			x: 0,
			y: 0
		}
	},

	/**
	 * Scrolls to a set of coordinates.
	 *
	 * @param {Number} x      The x coordinate.
	 * @param {Number} y      The y coordinate.
	 * @param {Number} [time] The duration of the scroll.
	 *
	 * @return {ScrollView} This scroll view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollTo: function(x, y, time, relative) {
		this.scroller.scrollTo(x, y, time, relative);
		return this;
	},

	/**
	 * Scrolls to page.
	 *
	 * @param {Number} pageX  The horizontal page number.
	 * @param {Number} pageY  The vertical page number.
	 * @param {Number} [time] The duration of the scroll.
	 *
	 * @return {Scroller} This scroller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollToPage: function(pageX, pageY, time) {
		this.scroller.scrollToPage(pageX, pageY, time);
		return this;
	},

	/**
	 * Scrolls to an element.
	 *
	 * @param {Element} element The element to scroll to.
	 * @param {Number}  [time]  The duration of the scroll.
	 *
	 * @return {Scroller} This scroller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollToElement: function(element, time) {
		this.scroller.scrollToElement(element, time);
		return this;
	},

	/**
	 * Returns the current scroll position.
	 *
	 * This method will return the current scroll position as an object
	 * with two keys, `x` which indicates the horizontal scroll and `y` which
	 * indicates the vertical scroll of this entity.
	 *
	 * @return {Object} The scroll position.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getScroll: function() {
		return this.scroller.getScroll();
	},

	/**
	 * Returns the content's size including the scrolling area.
	 *
	 * This method will return the content's size as an object with two keys,
	 * `x` which indicates the width and `y` which indicates the height.
	 *
	 * @return {Object} The size including the scrolling area.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getScrollSize: function() {
		return this.scroller.getScrollSize();
	},

	willBuild: function() {

		this.parent();

		this.element.addClass('scroll-view');

		var options = {
			momentum: this.options.momentum,
			scrollX: this.options.scrollX,
			scrollY: this.options.scrollY,
			snapToPage: this.options.snapToPage,
			snapToPageAt: this.options.snapToPageAt,
			snapToPageDuration: this.options.snapToPageDuration,
			snapToPageDelay: this.options.snapToPageDelay
		};

		this.scroller = new Moobile.Scroller(this.content, options);
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
