/*
---

name: Scroller

description: Provides a wrapper for the iScroll scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventFirer

provides:
	- Scroller

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Scroller = new Class({

	Extends: Moobile.EventFirer,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_startScroll: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_startTime: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_startPage: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#page
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_page: {
		x: 0,
		y: 0
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#engine
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	engine: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#wrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	wrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#options
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
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(content, options) {

		this.setOptions(options);

		if (this.options.snapToPage)
			this.options.momentum = false;

		var engine  = null;
		var engines = Array.from(this.options.engine);

		for (var i = 0; i < engines.length; i++) {

			var candidate = Moobile.Scroller.Engine[engines[i]];
			if (candidate === undefined) {
				throw new Error('The scroller engine ' + candidate + ' does not exists');
			}

			if (candidate.supportsCurrentPlatform === undefined ||
				candidate.supportsCurrentPlatform &&
				candidate.supportsCurrentPlatform.call(this)) {
				engine = candidate;
				break;
			}
		}

		if (engine === null) {
			throw new Error('There are no scrolling engine available');
		}

		var options = {
			momentum: this.options.momentum,
			scrollX: this.options.scrollX,
			scrollY: this.options.scrollY
		};

		this.engine = new engine(content, options);
		this.engine.addEvent('dragstart', this.bound('_onDragStart'));
		this.engine.addEvent('dragend', this.bound('_onDragEnd'));
		this.engine.addEvent('scroll', this.bound('_onScroll'));

		this.wrapperElement = this.getWrapperElement();
		this.contentElement = this.getContentElement();

		var classes = this.contentElement.get('class');
		if (classes) {
			classes.split(' ').each(function(klass) {
				this.wrapperElement.addClass(klass + '-wrapper');
			}, this);
		}

		this.wrapperElement.addClass('scroll');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.engine.destroy();
		this.engine = null;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		this.engine.scrollTo(x, y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#scrollToPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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

		if (pageX === maxPageX) x = scroll.x - frame.x;
		if (pageY === maxPageY) y = scroll.y - frame.y;

		this.scrollTo(x, y, time);

		this._page.x = pageX;
		this._page.y = pageY;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		this.engine.scrollToElement(document.id(element), time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#snap
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	snap: function() {

		var frame = this.getSize();
		var scroll = this.getScroll();

		var time = Date.now() - this._startTime;

		var pageX = this._startPage.x;
		var pageY = this._startPage.y;

		var moveX = Math.round((scroll.x - this._startScroll.x) * 100 / frame.x);
		var moveY = Math.round((scroll.y - this._startScroll.y) * 100 / frame.y);

		var dirX = moveX >= 0 ? 1 : -1;
		var dirY = moveY >= 0 ? 1 : -1;

		if (Math.abs(this._startScroll.x - scroll.x) < 10) dirX = 0;
		if (Math.abs(this._startScroll.y - scroll.y) < 10) dirY = 0;

		if (Math.abs(moveX) >= this.options.snapToPageAt || time <= this.options.snapToPageDelay) pageX += dirX;
		if (Math.abs(moveY) >= this.options.snapToPageAt || time <= this.options.snapToPageDelay) pageY += dirY;

		this.scrollToPage(pageX, pageY, this.options.snapToPageDuration);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	refresh: function() {
		this.engine.refresh();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		return this.engine.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		return this.engine.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		return this.engine.getScrollSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getPage: function() {
		return this._page;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getContentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getContentElement: function() {
		return this.engine.getContentElement();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller#getWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getWrapperElement: function() {
		return this.engine.getWrapperElement();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onDragStart: function() {
		this._startScroll = this.getScroll();
		this._startPage = this.getPage();
		this._startTime = Date.now();
		this.fireEvent('dragstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onDragEnd: function() {

		if (this.options.snapToPage)
			this.snap();

		this._startScroll = null;
		this._startPage = null;
		this._startTime = null;

		this.fireEvent('dragend');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onScroll: function() {
		this._page.x = Math.floor(this.getScroll().x / this.getSize().x);
		this._page.y = Math.floor(this.getScroll().y / this.getSize().y);
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

		if (e.target.getParent('.scroll') === null) {
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
