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
Moobile.ScrollView = new Class( /** @lends ScrollView.prototype */ {

	Extends: Moobile.View,

	/**
	 * The scroller.
	 * @type   Scroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scroller: null,

	/**
	 * The element that wraps the content and make it scrollable.
	 * @type   Element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	wrapper: null,

	/**
	 * The class options.
	 * @type   Object
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

	willBuild: function() {
		this.parent();
		this.element.addClass('scroll-view');
	},

	didBuild: function() {

		this.parent();

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
		this.scroller.addEvent('dragstart', this.bound('onDragStart'));
		this.scroller.addEvent('dragend', this.bound('onDragEnd'));
		this.scroller.addEvent('scroll', this.bound('onScroll'));

		this.wrapper = this.scroller.getWrapper();
		this.wrapper.addClass('view-content-wrapper');
	},

	didBecomeReady: function() {
		this.parent();
		this.scroller.refresh();
	},

	destroy: function() {

		this.scroller.removeEvent('dragstart', this.bound('onDragStart'));
		this.scroller.removeEvent('dragend', this.bound('onDragEnd'));
		this.scroller.removeEvent('scroll', this.bound('onScroll'));

		this.scroller.destroy();
		this.scroller = null;

		this.parent();
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
	scrollTo: function(x, y, time) {
		this.scroller.scrollTo(x, y, time);
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

	onDragStart: function() {
		this.fireEvent('dragstart');
	},

	onDragEnd: function() {
		this.fireEvent('dragend');
	},

	onScroll: function() {
		this.fireEvent('scroll');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('scroll-view', null, function(element) {
	var instance = Moobile.Component.create(element, Moobile.ScrollView, 'data-scroll-view');
	this.addChild(instance);
});
