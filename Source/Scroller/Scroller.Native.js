/*
---

name: Scroller.Native

description: Provides a scroller that uses the native scrolling capabilities.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller

provides:
	- Scroller.Native

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Scroller.Native = new Class({

	Extends: Moobile.Scroller,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouch: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#contentScroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	contentScroller: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#contentScrollerElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	contentScrollerElement: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(contentElement, contentWrapperElement, options) {

		this.parent(contentElement, contentWrapperElement, options);

		var styles = {
			'top': 0, 'left': 0, 'bottom': 0, 'right': 0,
			'position': 'absolute',
			'overflow': 'auto',
			'overflow-scrolling': this.options.momentum ? 'touch' : 'auto'
		};

		var scrollFixOuterDiv = document.createElement('div');
		var scrollFixInnerDiv = document.createElement('div');
		scrollFixOuterDiv.setStyles(styles);
		scrollFixInnerDiv.setStyles(styles);
		scrollFixOuterDiv.wraps(contentElement);
		scrollFixInnerDiv.wraps(contentElement);

		this.contentScrollerElement = scrollFixInnerDiv;
		this.contentScrollerElement.addEvent('touchstart', this.bound('_onTouchStart'));
		this.contentScrollerElement.addEvent('touchend', this.bound('_onTouchEnd'));
		this.contentScrollerElement.addEvent('scroll', this.bound('_onScroll'));

		this.contentScroller = new Fx.Scroll(this.contentScrollerElement);

		window.addEvent('orientationchange', this.bound('_onOrientationChange'));

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	destroy: function() {

		this.contentScrollerElement.removeEvent('touchstart', this.bound('_onTouchStart'));
		this.contentScrollerElement.removeEvent('touchend', this.bound('_onTouchEnd'));
		this.contentScrollerElement.removeEvent('scroll', this.bound('_onScroll'));
		this.contentScrollerElement = null;

		this.contentScroller = null;

		window.addEvent('orientationchange', this.bound('_onOrientationChange'));

		this.parent();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getName: function() {
		return 'native';
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollTo: function(x, y, time) {

		x = x || 0;
		y = y || 0;

		var onStart = function() {
			this._detachEvents();
		}.bind(this);

		var onComplete = function() {
			this._attachEvents();
			this.contentScroller.removeEvents('cancel');
			this.contentScroller.removeEvents('complete');
			this.fireEvent('scroll');
		}.bind(this);

		this.contentScroller.cancel();

		this.contentScroller.setOptions({duration: time || 0});
		this.contentScroller.addEvent('start:once', onStart)
		this.contentScroller.addEvent('cancel:once', onComplete);
		this.contentScroller.addEvent('complete:once', onComplete);
		this.contentScroller.start(x, y);

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollToElement: function(element, time) {

		var onStart = function() {
			this._detachEvents();
		}.bind(this);

		var onComplete = function() {
			this._attachEvents();
			this.contentScroller.removeEvents('cancel');
			this.contentScroller.removeEvents('complete');
			this.fireEvent('scroll');
		}.bind(this);

		this.contentScroller.cancel();

		this.contentScroller.setOptions({duration: time || 0});
		this.contentScroller.addEvent('start:once', onStart)
		this.contentScroller.addEvent('cancel:once', onComplete);
		this.contentScroller.addEvent('complete:once', onComplete);
		this.contentScroller.toElement(element);

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {

		var wrapperSize = this.getSize();
		var contentSize = this.getScrollSize();

		if (this.options.momentum) {
			if (this.options.scrollY && contentSize.y <= wrapperSize.y) this.contentElement.setStyle('min-height', wrapperSize.y + 1);
			if (this.options.scrollX && contentSize.x <= wrapperSize.x) this.contentElement.setStyle('min-width',  wrapperSize.x + 1);
		}

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_attachEvents: function() {
		this.contentScrollerElement.addEvent('scroll', this.bound('_onScroll'));
		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_detachEvents: function() {
		this.contentScrollerElement.removeEvent('scroll', this.bound('_onScroll'));
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getSize: function() {
		return this.contentScrollerElement.getSize();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScroll: function() {
		return this.contentScrollerElement.getScroll();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScrollSize: function() {
		return this.contentElement.getScrollSize();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScroll: function() {
		this.fireEvent('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchStart: function(e) {
		if (this._activeTouch === null) {
			this._activeTouch = e.changedTouches[0];
			if (this.contentScroller.isRunning()) {
				this.contentScroller.cancel();
			}
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchEnd: function(e) {
		if (this._activeTouch.identifier === e.changedTouches[0].identifier) {
			this._activeTouch = null;
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onOrientationChange: function() {
		this.refresh();
	}

});

Moobile.Scroller.Native.supportsCurrentPlatform = function() {
	return Browser.Platform.ios && 'WebkitOverflowScrolling' in document.createElement('div').style;
};
