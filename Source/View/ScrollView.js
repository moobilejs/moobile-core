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
	_activeTouchStartScroll: null,

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
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	options: {
		scroller: ['Native', 'IScroll'],
		momentum: true,
		scrollX: false,
		scrollY: true,
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

		if (this.options.snapToPage) this.options.momentum = false;

		var options = {
			momentum: this.options.momentum,
			scrollX: this.options.scrollX,
			scrollY: this.options.scrollY,
		};

		this.contentElement.addEvent('touchcancel', this.bound('_onTouchCancel'));
		this.contentElement.addEvent('touchstart', this.bound('_onTouchStart'));
		this.contentElement.addEvent('touchend', this.bound('_onTouchEnd'));

		this._scroller = Moobile.Scroller.create(this.contentElement, this.contentWrapperElement, this.options.scroller, options);
		this._scroller.addEvent('scroll', this.bound('_onScroll'));
		this._scroller.addEvent('scrollend', this.bound('_onScrollEnd'));
		this._scroller.addEvent('scrollstart', this.bound('_onScrollStart'));

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

		this.contentElement.removeEvent('touchcancel', this.bound('_onTouchCancel'));
		this.contentElement.removeEvent('touchstart', this.bound('_onTouchStart'));
		this.contentElement.removeEvent('touchend', this.bound('_onTouchEnd'));

		this._scroller.removeEvent('scroll', this.bound('_onScroll'));
		this._scroller.removeEvent('scrollend', this.bound('_onScrollEnd'));
		this._scroller.removeEvent('scrollstart', this.bound('_onScrollStart'));
		this._scroller.destroy();
		this._scroller = null;

		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#setContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	setContentSize: function(x, y) {
		if (x >= 0) this.contentElement.setStyle('width', x);
		if (y >= 0) this.contentElement.setStyle('height', y);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getContentSize: function() {
		return this.contentElement.getScrollSize();
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
		this._scroller.scrollToElement(element, time);
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

		var frame = this.getSize();
		var total = this.getScrollSize();

		var xmax = total.x - frame.x;
		var ymax = total.y - frame.y;
		var x = (this.options.snapToPageSizeX || frame.x) * pageX;
		var y = (this.options.snapToPageSizeY || frame.y) * pageY;
		if (x > xmax) x = xmax;
		if (y > ymax) y = ymax;

		var scroll = this.getScroll();
		if (scroll.x !== x ||
			scroll.y !== y) {
			this.scrollTo(x, y, time);
		}

		if (this._page.x !== pageX ||
			this._page.y !== pageY) {
			this.fireEvent('scrolltopage', null, time);
		}

		this._page.x = pageX;
		this._page.y = pageY;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		return this._scroller.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getPage: function() {

		var x = 0;
		var y = 0;

		var pageSizeX = this.options.snapToPageSizeX || this.getSize().x;
		var pageSizeY = this.options.snapToPageSizeY || this.getSize().y;

		if (pageSizeX && pageSizeY) {

			var scroll = this.getScroll();
			scroll.x = scroll.x > 0 ? scroll.x : 0;
			scroll.y = scroll.y > 0 ? scroll.y : 0;

			x = Math.floor(scroll.x / pageSizeX);
			y = Math.floor(scroll.y / pageSizeY);
		}

		return {x: x, y: y};
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		return this._scroller.getScrollSize();
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

		var scroll = this.getScroll();
		scroll.x = scroll.x > 0 ? scroll.x : 0;
		scroll.y = scroll.y > 0 ? scroll.y : 0;

		var moveX = scroll.x - this._activeTouchStartScroll.x;
		var moveY = scroll.y - this._activeTouchStartScroll.y;
		var absMoveX = Math.abs(moveX);
		var absMoveY = Math.abs(moveY);

		if (moveX === 0 && moveY === 0)
			return this;

		var pageSizeX = this.options.snapToPageSizeX || this.getSize().x;
		var pageSizeY = this.options.snapToPageSizeY || this.getSize().y;
		var pageMoveX = Math.floor(absMoveX / pageSizeX);
		var pageMoveY = Math.floor(absMoveY / pageSizeY);
		var pageAreaX = (absMoveX - pageMoveX * pageSizeX) * 100 / pageSizeX;
		var pageAreaY = (absMoveY - pageMoveY * pageSizeY) * 100 / pageSizeY;

		var page = this.getPage();
		if (moveX < 0) page.x = page.x + 1;
		if (moveY < 0) page.y = page.y + 1;

		var frame = this.getSize();
		var total = this.getScrollSize();

		if (scroll.x + frame.x === total.x ||
			scroll.y + frame.y === total.y) {
			// handles uneven pages
			if ((scroll.x / pageSizeX - page.x) * 100 > 0) page.x = page.x + 1;
			if ((scroll.y / pageSizeY - page.y) * 100 > 0) page.y = page.y + 1;
		}

		var snapToPageAt = this.options.snapToPageAt;
		var snapToPageDelay = this.options.snapToPageDelay;
		var snapToPageDuration = this.options.snapToPageDuration

		if (pageAreaX > snapToPageAt || this._activeTouchDuration < snapToPageDelay) page.x += moveX > 0 ? 1 : -1;
		if (pageAreaY > snapToPageAt || this._activeTouchDuration < snapToPageDelay) page.y += moveY > 0 ? 1 : -1;

		this.scrollToPage(page.x, page.y, this.options.snapToPageDuration);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchCancel: function() {
		this._activeTouch = null;
		this._activeTouchTime = null;
		this._activeTouchDuration = null;
		this._activeTouchStartScroll = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchStart: function(e) {

		var touch = e.changedTouches[0];

		if (this._activeTouch === null) {
			this._activeTouch = touch;
			this._activeTouchTime = Date.now();
			this._activeTouchStartScroll = this.getScroll();
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchEnd: function(e) {

		var touch = e.changedTouches[0];

		if (this._activeTouch.identifier === touch.identifier) {
			this._activeTouchDuration = Date.now() - this._activeTouchTime;

			if (this.options.snapToPage) {
				if (this._activeTouchStartX !== touch.pageX ||
					this._activeTouchStartY !== touch.pageY) {
					this._snapToPage();
				}
			}

			this._activeTouch = null;
			this._activeTouchTime = null;
			this._activeTouchDuration = null;
			this._activeTouchStartScroll = null;
		}
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
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('scroll-view', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ScrollView, element, 'data-scroll-view'));
});
