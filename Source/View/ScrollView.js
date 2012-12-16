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

provides:
	- ScrollView

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/View/ScrollView
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.1
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.ScrollView = new Class({

	Extends: Moobile.View,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouch: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchTime: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchScroll: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchDuration: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_scroller: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_offset: {
		x: null,
		y: null,
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_page: {
		x: null,
		y: null,
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_pageOffset: {
		x: 0,
		y: 0,
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#options
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
		initialScrollY: 0
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

		// <0.1 compat>
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
		// </0.1 compat>

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

		this._scroller = Moobile.Scroller.create(this.contentElement, this.contentWrapperElement, this.options.scroller, options);
		this._scroller.addEvent('scroll', this.bound('_onScroll'));
		this._scroller.addEvent('scrollend', this.bound('_onScrollEnd'));
		this._scroller.addEvent('scrollstart', this.bound('_onScrollStart'));
		this._scroller.addEvent('touchcancel', this.bound('_onTouchCancel'));
		this._scroller.addEvent('touchstart', this.bound('_onTouchStart'));
		this._scroller.addEvent('touchend', this.bound('_onTouchEnd'));

		var name = this._scroller.getName();
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
		this._scroller.refresh();
		if (this.options.snapToPage) {
			this.scrollToPage(this.options.intialPageX, this.options.initialPageY);
		} else {
			this.scrollTo(this.options.initialScrollX, this.options.initialScrollY);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	destroy: function() {
		this._scroller.removeEvent('scroll', this.bound('_onScroll'));
		this._scroller.removeEvent('scrollend', this.bound('_onScrollEnd'));
		this._scroller.removeEvent('scrollstart', this.bound('_onScrollStart'));
		this._scroller.removeEvent('touchcancel', this.bound('_onTouchCancel'));
		this._scroller.removeEvent('touchstart', this.bound('_onTouchStart'));
		this._scroller.removeEvent('touchend', this.bound('_onTouchEnd'));
		this._scroller.destroy();
		this._scroller = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#setContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	setContentSize: function(x, y) {
		if (x >= 0 || x === null) this.contentElement.setStyle('width', x);
		if (y >= 0 || y === null) this.contentElement.setStyle('height', y);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentSize: function() {
		return this.contentElement.getScrollSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getContentWrapperSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentWrapperSize: function() {
		return this.contentWrapperElement.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getContentScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getContentScroll: function() {
		return this._scroller.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		this._scroller.scrollTo(x, y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		this._scroller.scrollToElement(element);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#scrollToPage
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

		if (this._page.x !== pageX ||
			this._page.y !== pageY) {
			this._pageOffset.x = Math.abs(x - pageX * pageSizeX);
			this._pageOffset.y = Math.abs(y - pageY * pageSizeY);
			this.fireEvent('scrolltopage', [pageX, pageY], time);
		}

		this._page.x = pageX;
		this._page.y = pageY;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getPage
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
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getPageOffset
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getPageOffset: function() {
		return this._pageOffset;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getScroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroller: function() {
		return this._scroller;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willHide: function() {
		this.parent();
		this._offset = this._scroller.getScroll();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didShow: function() {
		this.parent();
		this._scroller.refresh();
		this._scroller.scrollTo(this._offset.x, this._offset.y);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_snapToPage: function() {

		var scroll = this.getContentScroll();
		scroll.x = scroll.x > 0 ? scroll.x : 0;
		scroll.y = scroll.y > 0 ? scroll.y : 0;

		var moveX = scroll.x - this._activeTouchScroll.x;
		var moveY = scroll.y - this._activeTouchScroll.y;
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

		if (moveX < 0 || this._pageOffset.x > 0) page.x += 1;
		if (moveY < 0 || this._pageOffset.y > 0) page.y += 1;

		if (absMoveX >= 10 && (pageMoveX >= snapToPageAt || this._activeTouchDuration < snapToPageDelay)) page.x += moveX > 0 ? 1 : -1;
		if (absMoveY >= 10 && (pageMoveY >= snapToPageAt || this._activeTouchDuration < snapToPageDelay)) page.y += moveY > 0 ? 1 : -1;

		this.scrollToPage(page.x, page.y, this.options.snapToPageDuration);

		this.fireEvent('snaptopage', [page.x, page.y]);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	_onTouchCancel: function() {
		this._activeTouch = null;
		this._activeTouchTime = null;
		this._activeTouchScroll = null;
		this._activeTouchDuration = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	_onTouchStart: function(e) {

		var touch = e.changedTouches[0];

		if (this._activeTouch === null) {
			this._activeTouch = touch;
			this._activeTouchTime = Date.now();
			this._activeTouchScroll = this.getContentScroll();
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.1
	 * @since  0.2.0
	 */
	_onTouchEnd: function(e) {

		if (e.touches.length > 0)
			return;

		this._activeTouchDuration = Date.now() - this._activeTouchTime;

		if (this.options.snapToPage) this._snapToPage();

		this._activeTouch = null;
		this._activeTouchTime = null;
		this._activeTouchScroll = null;
		this._activeTouchDuration = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onScroll: function() {
		this.fireEvent('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScrollStart: function() {
		this.fireEvent('scrollstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScrollEnd: function() {
		this.fireEvent('scrollend');
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		console.log('[DEPRECATION NOTICE] The method "getScrollSize" will be removed in 0.3, use the method "getContentSize" instead');
		return this.getContentSize();
	},

	/**
	 * @deprecated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		console.log('[DEPRECATION NOTICE] The method "getScroll" will be removed in 0.3, use the method "getContentScroll" instead');
		return this.getContentScroll();
	},

});

/**
 * @see    http://moobilejs.com/doc/latest/View/View#MoobileViewAt
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.ScrollView.at = function(path, options, name) {

	var element = Element.at(path);
	if (element) {
		return Moobile.Component.create(Moobile.ScrollView, element, 'data-view', options, name);
	}

	return null;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('scroll-view', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ScrollView, element, 'data-scroll-view'));
});
