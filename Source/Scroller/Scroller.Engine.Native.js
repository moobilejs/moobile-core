/*
---

name: Scroller.Engine.Native

description: Provides a native scroller engine.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller.Engine

provides:
	- Scroller.Engine.Native

...
*/

/**
 * @name  Scroller.Engine.Native
 * @class Provides an engine that uses the native scroller overflow.
 *
 * @classdesc
 *
 * [TODO: Introduction]
 * [TODO: Events]
 * [TODO: Options]
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Scroller.Engine.Native = new Class( /** @lends Scroller.Engine.Native.prototype */ {

	Extends: Moobile.Scroller.Engine,

	scroller: null,

	scrolling: false,

	/**
	 * Initializes this scroller engine.
	 *
	 * This method will creates a `wrapper` element and wrap it around the
	 * given `content` element.
	 *
	 * @param {Element}	[content] The Element, element id or string.
	 * @param {Object}  [options] The options.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(content, options) {

		this.parent(content, options);

		this.wrapper.addClass('scroll-engine-native');

		if (this.options.scrollX)  this.wrapper.setStyle('overflow-x', 'scroll');
		if (this.options.scrollY)  this.wrapper.setStyle('overflow-y', 'scroll');
		if (this.options.momentum) this.wrapper.setStyle('-webkit-overflow-scrolling', 'touch');

		this.scroller = new Fx.Scroll(this.wrapper);

		this.wrapper.addEvent('scroll', this.bound('onScroll'));
		this.wrapper.addEvent('touchstart', this.bound('onTouchStart'));
		this.wrapper.addEvent('touchend', this.bound('onTouchEnd'));

		window.addEvent('rotate', this.bound('onWindowRotate'));

		return this;
	},

	/**
	 * Destroys this scroller engine.
	 *
	 * This method will remove the wrapper without removing the content
	 * element.
	 *
	 * @return {Scroller.Engine} This scroller engine.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		window.removeEvent('rotate', this.bound('onWindowRotate'));
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
	 * @return {Scroller.Engine} This scroller engine.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollTo: function(x, y, time) {

		time = time || 0;

		this.scroller.setOptions({duration: time});
		this.scroller.start(x, y);
		// TODO: proper events
		return this;
	},

	/**
	 * Scrolls to an element.
	 *
	 * @param {Element} element The element to scroll to.
	 * @param {Number}  [time]  The duration of the scroll.
	 *
	 * @return {Scroller.Engine} This scroller engine.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollToElement: function(element, time) {

		time = time || 0;

		element = document.id(element);

		this.scroller.setOptions({duration: time});
		this.scroller.toElement(element);

		return this;
	},

	/**
	 * Refreshes this scroller engine.
	 *
	 * @return {Scroller} This scroller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	refresh: function() {

		var wrapperSize = this.getSize();
		var contentSize = this.getScrollSize();

		if (contentSize.y <= wrapperSize.y) {
			this.content.setStyle('min-height', wrapperSize.y + 1);
		}

		return this;
	},

	/**
	 * Returns the size.
	 *
	 * This method will return the wrapper's size as an object with two keys,
	 * `x` which indicates the width and `y` which indicates the height.
	 *
	 * @return {Object} The size.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSize: function() {
		return this.wrapper.getSize();
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
		return this.wrapper.getScroll();
	},

	/**
	 * Returns size including the scrolling area.
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
		return this.content.getScrollSize();
	},

	scrollWatch: null,

	momentum: false,

	watchScroll: function() {

		if (this.momentum == false) {
			this.disableScrollWatch();
			this.fireEvent('scrollend');
			return;
		}

		this.fireEvent('scrollmove');
	},

	enableScrollWatch: function() {
		this.scrollWatch = this.watchScroll.periodical(1000 / 30, this);
	},

	disableScrollWatch: function() {
		clearTimeout(this.scrollWatch);
	},

	onTouchStart: function() {

		var scroll = this.wrapper.getScroll();
		if (scroll.x == 0) {
			if (scroll.y <= 0) {
				this.wrapper.scrollTo(0, 1);
			} else {
				var max = this.wrapper.getScrollSize();
				var size = this.wrapper.getSize();
				if (size.y + scroll.y >= max.y) {
					this.wrapper.scrollTo(0, scroll.y - 1);
				}
			}
		}

		if (this.momentum) {
			this.disableScrollWatch();
			this.fireEvent('scrollend');
		}

		this.momentum = false;

		this.fireEvent('dragstart');
		this.fireEvent('scrollstart');
	},

	onTouchEnd: function() {
		this.momentum = true;
		this.fireEvent('dragend');
		this.enableScrollWatch();
	},

	onScroll: function() {
		this.momentum = false;
		this.fireEvent('scrollmove');
	},

	onWindowRotate: function(e) {
		this.refresh();
	}

});

Moobile.Scroller.Engine.Native.supportsCurrentPlatform = function() {
	// TODO: Improve me, a lot.
	return /CPU OS 5_0/.test(navigator.userAgent);
};
