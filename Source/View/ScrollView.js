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
 * @see    http://moobilejs.com/doc/0.1/View/ScrollView
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
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
	 * @since  0.1.0
	 */
	_offset: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
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

		this._scroller = Moobile.Scroller.create(this.contentElement, this.contentWrapperElement, this.options.scroller, options);
		this._scroller.addEvent('scroll', this.bound('_onScroll'));
		this.contentElement.addEvent('touchstart', this.bound('_onTouchStart'));
		this.contentElement.addEvent('touchend', this.bound('_onTouchEnd'));

		var name = this._scroller.getName();
		if (name) {
			this.element.addClass(name + '-engine');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBecomeReady: function() {
		this.parent();
		this._scroller.refresh();
		this._scroller.scrollTo(
			this.options.initialScrollX,
			this.options.initialScrollY
		);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.contentElement.removeEvent('touchstart', this.bound('_onTouchStart'));
		this.contentElement.removeEvent('touchend', this.bound('_onTouchEnd'));
		this._scroller.removeEvent('scroll', this.bound('_onScroll'));
		this._scroller.destroy();
		this._scroller = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#setContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setContentSize: function(x, y) {
		this.contentElement.setStyle('width', x);
		this.contentElement.setStyle('height', y);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/View/View#getContentSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getContentSize: function() {
		return this.contentElement.getScrollSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		this._scroller.scrollTo(x, y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		this._scroller.scrollToElement(element, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#scrollToPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
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

		this.scrollTo(x, y, time);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		return this._scroller.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		return this._scroller.getScrollSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/View/ScrollView#getScroller
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

		var frame = this.getSize();
		var pageSizeX = (this.options.snapToPageSizeX || frame.x);
		var pageSizeY = (this.options.snapToPageSizeY || frame.y);

		//
		// the current page is always the page closest to the top left corner
		// of the screen. For instance, if the current page is 2 and the page
		// is dragged one pixel to the left, the current page will be 1 and the
		// move percentage will be 99.9
		//

		var scroll = this.getScroll();
		var pageX = Math.floor(scroll.x / pageSizeX);
		var pageY = Math.floor(scroll.y / pageSizeY);
		var moveX = (scroll.x / pageSizeX - pageX) * 100;
		var moveY = (scroll.y / pageSizeY - pageY) * 100;

		var snapToPageAt = this.options.snapToPageAt;
		var snapToPageDelay = this.options.snapToPageDelay;
		if (moveX > snapToPageAt || this._activeTouchDuration < snapToPageDelay) pageX += 1;
		if (moveY > snapToPageAt || this._activeTouchDuration < snapToPageDelay) pageY += 1;
		if (this._activeTouchDirectionX === 'left' && this._activeTouchDuration < snapToPageDelay) pageX -= 1;
		if (this._activeTouchDirectionY === 'top'  && this._activeTouchDuration < snapToPageDelay) pageY -= 1;

		return this.scrollToPage(pageX, pageY, this.options.snapToPageDuration);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchCancel: function() {
		this._activeTouch = null;
		this._activeTouchTime = null;
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
			this._activeTouchDirectionX = this._activeTouchStartX < touch.pageX ? 'left' : 'right';
			this._activeTouchDirectionY = this._activeTouchStartY < touch.pageY ? 'top'  : 'bottom';

			// TODO: Check whether the scroll is 0 and direction is left

			if (this.options.snapToPage) {
				if (this._activeTouchStartX !== touch.pageX ||
					this._activeTouchStartY !== touch.pageY) {
					this._snapToPage();
				}
			}

			this._activeTouch = null;
			this._activeTouchTime = null;
			this._activeTouchDuration = null;
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
