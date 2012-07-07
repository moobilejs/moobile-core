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
		snapToPageAt: 35,
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

		this._scroller.scrollTo(x, y, time);

		this._page.x = pageX;
		this._page.y = pageY;
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
	 * @since  0.1.0
	 */
	_snapToPage: function() {

	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTouchCancel: function() {
		this._activeTouch = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTouchStart: function(e) {
		if (this._activeTouch === null) {
			this._activeTouch = e.changedTouches[0];
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTouchEnd: function(e) {
		if (this._activeTouch.identifier === e.changedTouches.identifier) {
			this._activeTouch = null;
			if (this.options.snapToPage) this._snapToPage();
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
