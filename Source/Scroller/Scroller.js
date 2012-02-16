/*
---

name: Scroller

description: Provides a wrapper for the iScroll scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventDispatcher

provides:
	- Scroller

...
*/

/**
 * @name  Scroller
 * @class Provides the class that wraps a scroller engine.
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
Moobile.Scroller = new Class( /** @lends Scroller.prototype */ {

	Extends: Moobile.EventDispatcher,

	/**
	 * The engine.
	 * @type   Scroller.Engine
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	engine: null,

	/**
	 * The content element, with variable size.
	 * @type   Element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	content: null,

	/**
	 * The content wrapper element, with fixed size.
	 * @type   Element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	wrapper: null,

	/**
	 * The scrolling position at the beginning of a scroll.
	 * @type   Object
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	startScroll: null,

	/**
	 * The scrolling time at the beginning of a scroll.
	 * @type   Object
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	startTime: null,

	/**
	 * The scrolling page at the beginning of a scroll.
	 * @type   Object
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	startPage: null,

	/**
	 * The current page.
	 * @type   Object
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	page: {
		x: 0,
		y: 0
	},

	/**
	 * The class options.
	 * @type   Object
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		engine: ['Native', 'IScroll'],
		momentum: true,
		scrollX: true,
		scrollY: true,
		snapToPage: false,
		snapToPageAt: 35,
		snapToPageDuration: 150,
		snapToPageDelay: 150
	},

	/**
	 * Initializes this scroller.
	 *
	 * This `content` element given to this method will be wrapped with an
	 * other element. Any CSS classes given to the `content` element will be
	 * added to the wrapper element with the `-wrapper` suffix.
	 *
	 * This method also creates a scroller engine that is proper for the
	 * current platform based on the `engine` option.
	 *
	 * @param {Element}	[content] The Element, element id or string.
	 * @param {Object}  [options] The options.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(content, options) {

		this.setOptions(options);

		if (this.options.snapToPage)
			this.options.momentum = false;

		var engine  = null;
		var engines = Array.from(this.options.engine);

		for (var i = 0; i < engines.length; i++) {

			var candidate = Moobile.Scroller.Engine[engines[i]];
			if (candidate == undefined) {
				throw new Error('The scroller engine ' + candidate + ' does not exists');
			}

			if (candidate.supportsCurrentPlatform == undefined ||
				candidate.supportsCurrentPlatform &&
				candidate.supportsCurrentPlatform.call(this)) {
				engine = candidate;
				break;
			}
		}

		if (engine == null) {
			throw new Error('There are no scrolling engine available');
		}

		var options = {
			momentum: this.options.momentum,
			scrollX: this.options.scrollX,
			scrollY: this.options.scrollY
		};

		this.engine = new engine(content, options);
		this.engine.addEvent('dragstart', this.bound('onDragStart'));
		this.engine.addEvent('dragend', this.bound('onDragEnd'));
		this.engine.addEvent('scroll', this.bound('onScroll'));

		this.wrapper = this.getWrapper();
		this.content = this.getContent();

		var classes = this.content.get('class');
		if (classes) {
			classes.split(' ').each(function(klass) {
				this.wrapper.addClass(klass + '-wrapper');
			}, this);
		}

		this.wrapper.addClass('scroll');

		return this;
	},

	/**
	 * Destroys this scroller.
	 *
	 * This method will destroy the scroller engine. The scrollable content
	 * will not be removed upon destruction as the content wrapper will.
	 *
	 * @return {Scroller} This scroller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this.engine.destroy();
		this.engine = null;
		return this;
	},

	/**
	 * Scrolls to a set of coordinates.
	 *
	 * @param {Number} x      The x coordinate.
	 * @param {Number} y      The y coordinate.
	 * @param {Number} [time] The duration of the scroll.
	 *
	 * @return {Scroller} This scroller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollTo: function(x, y, time) {
		this.engine.scrollTo(x, y, time);
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

		pageX = pageX || 0;
		pageY = pageY || 0;

		var frame = this.getSize();
		var scroll = this.getScrollSize();

		var maxPageX = Math.ceil(scroll.x / frame.x) - 1;
		var maxPageY = Math.ceil(scroll.y / frame.y) - 1;

		if (pageX < 0) pageX = 0;
		if (pageY < 0) pageY = 0;

		if (pageX > maxPageX) pageX = maxPageX;
		if (pageY > maxPageY) pageY = maxPageY;

		var x = frame.x * pageX;
		var y = frame.y * pageY;

		if (pageX == maxPageX) x = scroll.x - frame.x;
		if (pageY == maxPageY) y = scroll.y - frame.y;

		this.scrollTo(x, y, time);

		this.page.x = pageX;
		this.page.y = pageY;

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
		this.engine.scrollToElement(document.id(element), time);
		return this;
	},

	/**
	 * Snaps to the proper page.
	 *
	 * This method will snap to the closest page based on the scroller options.
	 * You should seldom need to call this method as it's called automatically
	 * when the `snapToPage` option is enabled.
	 *
	 * @return {Scroller} This scroller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	snap: function() {

		var frame = this.getSize();
		var scroll = this.getScroll();

		var time = Date.now() - this.startTime;

		var pageX = this.startPage.x;
		var pageY = this.startPage.y;

		var moveX = Math.round((scroll.x - this.startScroll.x) * 100 / frame.x);
		var moveY = Math.round((scroll.y - this.startScroll.y) * 100 / frame.y);

		var dirX = moveX >= 0 ? 1 : -1;
		var dirY = moveY >= 0 ? 1 : -1;

		if (Math.abs(this.startScroll.x - scroll.x) < 10) dirX = 0;
		if (Math.abs(this.startScroll.y - scroll.y) < 10) dirY = 0;

		if (Math.abs(moveX) >= this.options.snapToPageAt || time <= this.options.snapToPageDelay) pageX += dirX;
		if (Math.abs(moveY) >= this.options.snapToPageAt || time <= this.options.snapToPageDelay) pageY += dirY;

		this.scrollToPage(pageX, pageY, this.options.snapToPageDuration);

		return this;
	},

	/**
	 * Refreshes this scroller.
	 *
	 * What this method exacly does is based on this scroller engine
	 * implementation of the `refresh` method.
	 *
	 * @return {Scroller} This scroller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	refresh: function() {
		this.engine.refresh();
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
		return this.engine.getSize();
	},

	/**
	 * Returns the current scroll position.
	 *
	 * This method will return the current scroll position as an object
	 * with two keys, `x` which indicates the horizontal scroll and `y` which
	 * indicates the vertical scroll of this child.
	 *
	 * @return {Object} The scroll position.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getScroll: function() {
		return this.engine.getScroll();
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
		return this.engine.getScrollSize();
	},

	/**
	 * Returns the current page.
	 *
	 * This method will return the current page as an object with two keys,
	 * `x` which indicates horizontal page and `y` which indicates the vertical
	 * page.
	 *
	 * @return {Object} This scroller's current page.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getPage: function() {
		return this.page;
	},

	/**
	 * Returns the content element.
	 *
	 * @return {Element} The content element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getContent: function() {
		return this.engine.getContent();
	},

	/**
	 * Returns the wrapper element.
	 *
	 * @return {Element} The wrapper element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getWrapper: function() {
		return this.engine.getWrapper();
	},

	onDragStart: function() {
		this.startScroll = this.getScroll();
		this.startPage = this.getPage();
		this.startTime = Date.now();
		this.fireEvent('dragstart');
	},

	onDragEnd: function() {

		if (this.options.snapToPage)
			this.snap();

		this.startScroll = null;
		this.startPage = null;
		this.startTime = null;

		this.fireEvent('dragend');
	},

	onScroll: function() {
		this.page.x = Math.floor(this.getScroll().x / this.getSize().x);
		this.page.y = Math.floor(this.getScroll().y / this.getSize().y);
		this.fireEvent('scroll');
	}

});

(function() {

window.addEvent('domready', function(e) {

	var pos = null;

	document.addEvent('touchstart', function(e) {
		pos = e.client;
	});

	document.addEvent('touchmove', function(e) {

		if (e.target.getParent('.scroll') == null) {
			e.preventDefault();
		} else {

			//
			// TODO
			// This part has to be improved, right now only a pure horizontal
			// move will allow the whole thing to move
			//

			//if (Math.abs(e.client.y - pos.y) > Math.abs(e.client.x - pos.x))
			//	e.preventDefault();
		}
	});
});

})();
