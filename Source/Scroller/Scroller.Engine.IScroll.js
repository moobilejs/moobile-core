/*
---

name: Scroller.Engine.scroller

description: Provides a wrapper for the scroller scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller.Engine

provides:
	- Scroller.Engine.scroller

...
*/

(function() {

iScroll.prototype._currentSize = {x: 0, y: 0};

var _checkDOMChanges = iScroll.prototype._checkDOMChanges;

iScroll.prototype._checkDOMChanges = function() {

	_checkDOMChanges.call(this);

	var size = this.wrapper.getSize();
	if (this._currentSize.x != size.x || this._currentSize.y != size.y) {
		this._currentSize = size;
		this.refresh();
	}
};

})();

/**
 * @name  Scroller.Engine.Native
 * @class Provides an engine that uses the iScroll scroller.
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
Moobile.Scroller.Engine.IScroll = new Class( /** @lends Scroller.Engine.scroller.prototype */ {

	Extends: Moobile.Scroller.Engine,

	scroller: null,

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

		this.wrapper.addClass('scroll-engine-iscroll');

		var options = {
			hScroll: this.options.scrollX,
			vScroll: this.options.scrollY,
			momentum: this.options.momentum,
			bounce: this.options.momentum,
			hScrollbar: this.options.momentum,
			vScrollbar: this.options.momentum,
			useTransform: true,
			useTransition: true,
			hideScrollbar: true,
			fadeScrollbar: true,
			checkDOMChanges: true,
			snap: false,
			onScrollMove: this.bound('onScrollMove'),
			onScrollEnd: this.bound('onScrollEnd')
		};

		this.scroller = new iScroll(this.wrapper, options);

		this.wrapper.addEvent('mousedown', this.bound('onMouseDown'));
		this.wrapper.addEvent('mouseup', this.bound('onMouseUp'));

		window.addEvent('orientationchange', this.bound('onOrientationChange'));

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
		this.scroller.destroy();
		this.parent();
		return this;
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
		(function() { this.scroller.scrollTo(-x, -y, time); }).delay(5, this);
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
		var p = element.getPosition(this.content);
		this.scrollTo(p.x, p.y, time);
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
		this.scroller.refresh();
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
		return {x: -this.scroller.x, y: -this.scroller.y};
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

	onMouseDown: function() {
		this.fireEvent('dragstart');
	},

	onMouseUp: function() {
		this.fireEvent('dragend');
	},

	onScrollMove: function() {
		this.fireEvent('scroll');
	},

	onScrollEnd: function() {
		this.fireEvent('scroll');
	},

	onOrientationChange: function() {
		this.refresh();
	}

});

Moobile.Scroller.Engine.IScroll.supportsCurrentPlatform = function() {
	return true;
};
