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
	_activeTouchStartX: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchStartY: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchStartPage: null,

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
	_activeTouchDirectionX: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchDirectionY: null,

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
		scroller: ['IScroll.Android', 'Native', 'IScroll'],
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
		this.element.addClass('scroll-view');
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

		var name = this._scroller.getName();
		if (name) {
			this.element.addClass(name + '-engine');
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
		this.contentElement.setStyle('width', x);
		this.contentElement.setStyle('height', y);
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
		if (scroll.x !== x &&
			scroll.y !== y) {
			this.scrollTo(x, y, time);
		}

		if (this._page.x !== pageX ||
			this._page.y !== pageY) {
			this._page.x = pageX;
			this._page.y = pageY;
			this.fireEvent('scrolltopage', null, time);
		}

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
	 * @see    http://moobilejs.com/doc/latest/View/ScrollView#getPageLocation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getPageScroll: function() {

		var x = 0;
		var y = 0;

		var pageSizeX = this.options.snapToPageSizeX || this.getSize().x;
		var pageSizeY = this.options.snapToPageSizeY || this.getSize().y;

		if (pageSizeX && pageSizeY) {
			var page = this.getPage();
			var scroll = this.getScroll();
			scroll.x = scroll.x > 0 ? scroll.x : 0;
			scroll.y = scroll.y > 0 ? scroll.y : 0;
			x = (scroll.x / pageSizeX - page.x) * 100;
			y = (scroll.y / pageSizeY - page.y) * 100;
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

		var snapToPageAt = this.options.snapToPageAt;
		var snapToPageDelay = this.options.snapToPageDelay;
		var snapToPageDuration = this.options.snapToPageDuration

		var scroll = this.getScroll();
		scroll.x = scroll.x > 0 ? scroll.x : 0;
		scroll.y = scroll.y > 0 ? scroll.y : 0;

		var page = this.getPage();
		var move = this.getPageScroll();

		if (scroll.x > 0 && this._activeTouchDirectionX === 'lf') {
			move.x = 100 - move.x;
			page.x += 1
		}

		if (scroll.y > 0 && this._activeTouchDirectionY === 'tp') {
			move.y = 100 - move.y;
			page.y += 1;
		}

		var values = {
			'rg':  1,
			'lf': -1,
			'tp': -1,
			'bt':  1
		};

		if (move.x > snapToPageAt || this._activeTouchDuration < snapToPageDelay) page.x += values[this._activeTouchDirectionX];
		if (move.y > snapToPageAt || this._activeTouchDuration < snapToPageDelay) page.y += values[this._activeTouchDirectionY];

		this.scrollToPage(page.x, page.y, snapToPageDuration);

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
		this._activeTouchStartX = null;
		this._activeTouchStartY = null;
		this._activeTouchDirectionX = null;
		this._activeTouchDirectionY = null;
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
			this._activeTouchStartX = touch.pageX;
			this._activeTouchStartY = touch.pageY;
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
			this._activeTouchDirectionX = this._activeTouchStartX < touch.pageX ? 'lf' : 'rg';
			this._activeTouchDirectionY = this._activeTouchStartY < touch.pageY ? 'tp' : 'bt';

			if (this.options.snapToPage) {
				if (this._activeTouchStartX !== touch.pageX ||
					this._activeTouchStartY !== touch.pageY) {
					this._snapToPage();
				}
			}

			this._activeTouch = null;
			this._activeTouchTime = null;
			this._activeTouchDuration = null;
			this._activeTouchStartX = null;
			this._activeTouchStartY = null;
			this._activeTouchDirectionX = null;
			this._activeTouchDirectionY = null;
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onScroll: function() {
		this.fireEvent('scroll');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('scroll-view', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.ScrollView, element, 'data-scroll-view'));
});
