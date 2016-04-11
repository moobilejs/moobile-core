"use strict"

var requestFrame = require('moofx/lib/frame').request;
var cancelFrame  = require('moofx/lib/frame').cancel;

/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
var Native = moobile.Scroller.Native = new Class({

	Extends: moobile.Scroller,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_animating: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_animation: null,

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

		if (this.options.snapToPage) {
			this.options.momentum = false;
			this.options.bounce = false;
		}

		this.contentWrapperElement.setStyle('overflow', 'auto');
		this.contentWrapperElement.setStyle('overflow-scrolling', 'touch');

		var styles = {
			'top': 0, 'left': 0, 'bottom': 0, 'right': 0,
			'position': 'absolute',
			'overflow': 'auto',
			'overflow-scrolling': this.options.momentum ? 'touch' : 'auto'
		};

		this.contentScrollerElement = document.createElement('div');
		this.contentScrollerElement.setStyles(styles);
		this.contentScrollerElement.wraps(contentElement);

		this.contentScrollerElement.addEvent('touchstart', this.bound('_onTouchStart'));
		this.contentScrollerElement.addEvent('touchmove', this.bound('_onTouchMove'));
		this.contentScrollerElement.addEvent('touchend', this.bound('_onTouchEnd'));
		this.contentScrollerElement.addEvent('scroll', this.bound('_onScroll'));

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
		this.contentScrollerElement.removeEvent('touchmove', this.bound('_onTouchMove'));
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
		time = time || 0;

		if (this._animating) {
			this._animating = false;
			cancelFrame(this._animation);
		}

		var now = Date.now();

		var self = this;
		var elem = this.contentScrollerElement;

		var absX = Math.abs(x);
		var absY = Math.abs(y);

		var currX = elem.scrollLeft;
		var currY = elem.scrollTop;

		var dirX = x - currX;
		var dirY = y - currY;

		var update = function() {

			if (elem.scrollLeft === x &&
				elem.scrollTop === y) {
				self.fireEvent('scroll');
				self._animating = false;
				self._animation = null;
				return;
			}

			var valueX = ((Date.now() - now) * (x - currX) / time);
			var valueY = ((Date.now() - now) * (y - currY) / time);
			var scrollX = valueX + currX;
			var scrollY = valueY + currY;

			if ((scrollX >= x && dirX >= 0) || (scrollX < x && dirX < 0)) scrollX = x;
			if ((scrollY >= y && dirY >= 0) || (scrollY < y && dirY < 0)) scrollY = y;

			elem.scrollLeft = scrollX;
			elem.scrollTop  = scrollY;

			self._animating = true;
			self._animation = requestFrame(update);
		};

		this._animation = requestFrame(update);

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollToElement: function(element, time) {

		var elem = document.id(element);
		if (elem) {
			var p = element.getPosition(this.contentElement);
			this.scrollTo(p.x, p.y, time);
		}

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {

		var wrapperSize = this.contentWrapperElement.getSize();
		var contentSize = this.contentElement.getScrollSize();

		if (this.options.momentum) {
			var scrollX = this.options.scroll === 'both' || this.options.scroll === 'horizontal';
			var scrollY = this.options.scroll === 'both' || this.options.scroll === 'vertical';
			if (scrollY && contentSize.y <= wrapperSize.y) this.contentElement.setStyle('min-height', wrapperSize.y + 1);
			if (scrollX && contentSize.x <= wrapperSize.x) this.contentElement.setStyle('min-width',  wrapperSize.x + 1);
		}

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
		this.fireEvent('touchstart', e);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchMove: function(e) {
		this.fireEvent('touchmove', e);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchEnd: function(e) {
		this.fireEvent('touchend', e);
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

moobile.Scroller.Native.supportsCurrentPlatform = function() {
	return Browser.platform === 'ios' && 'WebkitOverflowScrolling' in document.createElement('div').style;
};
