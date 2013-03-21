"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.1
 * @since  0.1.0
 */
var ScrollView = moobile.ScrollView = new Class({

	Extends: moobile.View,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouch: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchTime: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchScroll: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchDuration: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__activeTouchCanceled: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__scroller: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__offset: {
		x: null,
		y: null,
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__page: {
		x: null,
		y: null,
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__pageOffset: {
		x: 0,
		y: 0,
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__scrollToPageTimer: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__contentSize: {
		x: null,
		y: null
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	options: {
		scroller: ['Native', 'IScroll'],
		scroll: 'vertical',
		scrollbar: 'vertical',
		bounce: Browser.Platform.ios,
		momentum: true,
		snapToPage: false,
		snapToPageAt: 20,
		snapToPageSizeX: null,
		snapToPageSizeY: null,
		snapToPageDuration: 150,
		snapToPageDelay: 150,
		initialPageX: 0,
		initialPageY: 0,
		initialScrollX: 0,
		initialScrollY: 0,
		cancelTouchThresholdX: 10,
		cancelTouchThresholdY: 10
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('scroll-view');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		// <deprecated>
		if ('scrollX' in this.options || 'scrollY' in this.options) {
			console.log('[DEPRECATION NOTICE] The options "scrollX" and "scrollY" will be removed in 0.4, use the "scroll" option instead');
			if (this.options.scrollX &&
				this.options.scrollY) {
				this.options.scroll = 'both';
			} else {
				if (this.options.scrollX) this.options.scroll = 'horizontal';
				if (this.options.scrollY) this.options.scroll = 'vertical';
			}
		}
		// </deprecated>

		var options = {
			scroll: this.options.scroll,
			scrollbar: this.options.scrollbar,
			bounce: this.options.bounce,
			momentum: this.options.momentum,
			snapToPage: this.options.snapToPage,
			snapToPageAt: this.options.snapToPageAt,
			snapToPageSizeX: this.options.snapToPageSizeX,
			snapToPageSizeY: this.options.snapToPageSizeY,
			snapToPageDuration: this.options.snapToPageDuration,
			snapToPageDelay: this.options.snapToPageDelay
		};

		this.__scroller = moobile.Scroller.create(this.contentElement, this.contentWrapperElement, this.options.scroller, options);
		this.__scroller.on('scroll', this.bound('__onScroll'));
		this.__scroller.on('scrollend', this.bound('__onScrollEnd'));
		this.__scroller.on('scrollstart', this.bound('__onScrollStart'));
		this.__scroller.on('touchcancel', this.bound('__onTouchCancel'));
		this.__scroller.on('touchstart', this.bound('__onTouchStart'));
		this.__scroller.on('touchend', this.bound('__onTouchEnd'));

		var name = this.__scroller.getName();
		if (name) {
			this.addClass(name + '-engine');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBecomeReady: function() {

		this.parent();

		var x = this.options.initialScrollX;
		var y = this.options.initialScrollY;
		var s = 'scrollTo';

		if (this.options.snapToPage) {
			x = this.options.initialPageX;
			y = this.options.initialPageY;
			s = 'scrollToPage';
		}

		this.__scroller.refresh();

		this[s].call(this, x, y);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jean-philippe.dery@lemieuxbedard.com)
	 * @since 3.0.0
	 */
	didUpdateLayout: function() {
		this.parent();
		this.__scroller.refresh();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	destroy: function() {
		this.__scroller.off('scroll', this.bound('__onScroll'));
		this.__scroller.off('scrollend', this.bound('__onScrollEnd'));
		this.__scroller.off('scrollstart', this.bound('__onScrollStart'));
		this.__scroller.off('touchcancel', this.bound('__onTouchCancel'));
		this.__scroller.off('touchstart', this.bound('__onTouchStart'));
		this.__scroller.off('touchend', this.bound('__onTouchEnd'));
		this.__scroller.destroy();
		this.__scroller = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#setContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	setContentSize: function(x, y) {

		if (x >= 0 || x === null) this.contentElement.setStyle('width', x);
		if (y >= 0 || y === null) this.contentElement.setStyle('height', y);

		if (this.__contentSize.x !== x ||
			this.__contentSize.y !== y) {
			this.updateLayout();
		}

		this.__contentSize.x = x;
		this.__contentSize.y = y;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentSize: function() {
		return this.contentElement.getScrollSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getContentWrapperSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentWrapperSize: function() {
		return this.contentWrapperElement.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getContentScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentScroll: function() {
		return this.__scroller.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		this.__scroller.scrollTo(x, y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		this.__scroller.scrollToElement(element);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#scrollToPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	scrollToPage: function(pageX, pageY, time) {

		pageX = pageX || 0;
		pageY = pageY || 0;

		if (pageX < 0) pageX = 0;
		if (pageY < 0) pageY = 0;

		var frame = this.getContentWrapperSize();
		var total = this.getContentSize();

		var pageSizeX = this.options.snapToPageSizeX || this.getContentWrapperSize().x;
		var pageSizeY = this.options.snapToPageSizeY || this.getContentWrapperSize().y;

		var xmax = total.x - frame.x;
		var ymax = total.y - frame.y;
		var x = pageSizeX * pageX;
		var y = pageSizeY * pageY;
		if (x > xmax) x = xmax;
		if (y > ymax) y = ymax;

		var scroll = this.getContentScroll();
		if (scroll.x !== x ||
			scroll.y !== y) {
			this.scrollTo(x, y, time);
		}

		if (this.__scrollToPageTimer) {
			clearTimeout(this.scrolltopage);
			this.__scrollToPageTimer = null;
		}

		if (this.__page.x !== pageX ||
			this.__page.y !== pageY) {
			this.__pageOffset.x = Math.abs(x - pageX * pageSizeX);
			this.__pageOffset.y = Math.abs(y - pageY * pageSizeY);
			this.__scrollToPageTimer = this.emit.delay(time + 5, this, ['scrolltopage', [pageX, pageY]]);
		}

		this.__page.x = pageX;
		this.__page.y = pageY;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getPage: function() {

		var x = 0;
		var y = 0;

		var pageSizeX = this.options.snapToPageSizeX || this.getContentWrapperSize().x;
		var pageSizeY = this.options.snapToPageSizeY || this.getContentWrapperSize().y;

		if (pageSizeX && pageSizeY) {

			var scroll = this.getContentScroll();
			scroll.x = scroll.x > 0 ? scroll.x : 0;
			scroll.y = scroll.y > 0 ? scroll.y : 0;

			x = Math.floor(scroll.x / pageSizeX);
			y = Math.floor(scroll.y / pageSizeY);
		}

		return {x: x, y: y};
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getPageOffset
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getPageOffset: function() {
		return this.__pageOffset;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.View/ScrollView#getScroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroller: function() {
		return this.__scroller;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willHide: function() {
		this.parent();
		this.__offset = this.__scroller.getScroll();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didShow: function() {
		this.parent();
		this.__scroller.refresh();
		this.__scroller.scrollTo(this.__offset.x, this.__offset.y);
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__snapToPage: function() {

		var size = this.getContentSize();
		var scroll = this.getContentScroll();
		scroll.x = scroll.x > 0 ? scroll.x : 0;
		scroll.y = scroll.y > 0 ? scroll.y : 0;

		var moveX = scroll.x - this.__activeTouchScroll.x;
		var moveY = scroll.y - this.__activeTouchScroll.y;
		var absMoveX = Math.abs(moveX);
		var absMoveY = Math.abs(moveY);

		if (moveX === 0 && moveY === 0)
			return this;

		var scrollX = this.options.scroll === 'both' || this.options.scroll === 'horizontal';
		var scrollY = this.options.scroll === 'both' || this.options.scroll === 'vertical';

		var snapToPageAt = this.options.snapToPageAt;
		var snapToPageDelay = this.options.snapToPageDelay;
		var snapToPageDuration = this.options.snapToPageDuration

		var pageSizeX = this.options.snapToPageSizeX || this.getContentWrapperSize().x;
		var pageSizeY = this.options.snapToPageSizeY || this.getContentWrapperSize().y;
		var pageMoveX = (absMoveX - Math.floor(absMoveX / pageSizeX) * pageSizeX) * 100 / pageSizeX;
		var pageMoveY = (absMoveY - Math.floor(absMoveY / pageSizeY) * pageSizeY) * 100 / pageSizeY;

		var page = this.getPage();

		if (moveX < 0 || this.__pageOffset.x > 0) page.x += 1;
		if (moveY < 0 || this.__pageOffset.y > 0) page.y += 1;

		if (absMoveX >= 10 && (pageMoveX >= snapToPageAt || this.__activeTouchDuration < snapToPageDelay)) page.x += moveX > 0 ? 1 : -1;
		if (absMoveY >= 10 && (pageMoveY >= snapToPageAt || this.__activeTouchDuration < snapToPageDelay)) page.y += moveY > 0 ? 1 : -1;

		if (page.x < 0) page.x = 0;
		if (page.y < 0) page.y = 0;
		if ((page.x + 1) * pageSizeX > size.x) page.x = Math.floor(size.x / pageSizeX) - 1;
		if ((page.y + 1) * pageSizeY > size.y) page.y = Math.floor(size.y / pageSizeY) - 1;

		this.scrollToPage(page.x, page.y, this.options.snapToPageDuration);

		this.emit('snaptopage', [page.x, page.y]);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__cancelTouch: function() {
		this.contentElement.getElements('*').each(function(element) {
			var event = document.createEvent('CustomEvent');
			event.initCustomEvent('touchcancel', false, false);
			element.dispatchEvent(event);
		});
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	__onTouchCancel: function() {
		this.__activeTouch = null;
		this.__activeTouchTime = null;
		this.__activeTouchScroll = null;
		this.__activeTouchDuration = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	__onTouchStart: function(e) {

		var touch = e.changedTouches[0];

		if (this.__activeTouch === null) {
			this.__activeTouch = touch;
			this.__activeTouchTime = Date.now();
			this.__activeTouchScroll = this.getContentScroll();
			this.__activeTouchCanceled = false;
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	__onTouchEnd: function(e) {

		if (e.touches.length > 0)
			return;

		this.__activeTouchDuration = Date.now() - this.__activeTouchTime;

		if (this.options.snapToPage) this.__snapToPage();

		this.__activeTouch = null;
		this.__activeTouchTime = null;
		this.__activeTouchScroll = null;
		this.__activeTouchDuration = null;
		this.__activeTouchCanceled = false;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onScroll: function() {

		if (this.__activeTouch &&
			this.__activeTouchCanceled === false) {
			var scroll = this.getContentScroll();
			var x = Math.abs(this.__activeTouchScroll.x - scroll.x);
			var y = Math.abs(this.__activeTouchScroll.y - scroll.y);
			if (x >= this.options.cancelTouchThresholdX ||
				y >= this.options.cancelTouchThresholdY) {
				this.__activeTouchCanceled = true
				this.__cancelTouch();
			}
		}

		this.emit('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__onScrollStart: function() {
		this.emit('scrollstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__onScrollEnd: function() {
		this.emit('scrollend');
	},

	/* Deprecated */

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		console.log('[DEPRECATION NOTICE] The method "getScrollSize" will be removed in 0.4, use the method "getContentSize" instead');
		return this.getContentSize();
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		console.log('[DEPRECATION NOTICE] The method "getScroll" will be removed in 0.4, use the method "getContentScroll" instead');
		return this.getContentScroll();
	},

});

/**
 * @see    http://moobilejs.com/doc/latest/moobile.View/moobile.View#Moobilemoobile.ViewAt
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
ScrollView.at = function(path, options, name) {

	var element = Element.at(path);
	if (element) {
		return moobile.Component.create(ScrollView, element, 'data-view', options, name);
	}

	return null;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('scroll-view', null, function(element) {
	this.addChildComponent(moobile.Component.create(ScrollView, element, 'data-scroll-view'));
});

