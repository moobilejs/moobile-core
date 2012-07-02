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
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#scroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scroller: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#outerWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	outerWrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#innerWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	innerWrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#initialize
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

		this.outerWrapperElement = document.createElement('div');
		this.innerWrapperElement = document.createElement('div');
		this.outerWrapperElement.setStyles(styles);
		this.innerWrapperElement.setStyles(styles);
		this.outerWrapperElement.wraps(contentElement);
		this.innerWrapperElement.wraps(contentElement);
		this.innerWrapperElement.addEvent('scroll', this.bound('_onScroll'));

		this.scroller = new Fx.Scroll(this.innerWrapperElement);

		window.addEvent('orientationchange', this.bound('_onOrientationChange'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	destroy: function() {

		this.innerWrapperElement.removeEvent('scroll', this.bound('_onScroll'));
		this.innerWrapperElement = null;
		this.outerWrapperElement = null;

		this.scroller = null;

		window.addEvent('orientationchange', this.bound('_onOrientationChange'));

		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getName: function() {
		return 'native';
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollTo: function(x, y, time) {

		var onEnd = function() {
			this.fireEvent('scroll');
			this._attachScrollListener();
		}.bind(this);

		this._detachScrollListener();

		this.scroller.setOptions({duration: time || 0});
		this.scroller.start(x, y);
		this.scroller.addEvent('cancel:once', onEnd);
		this.scroller.addEvent('complete:once', onEnd);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollToElement: function(element, time) {

		var onEnd = function() {
			this.fireEvent('scroll');
			this._attachScrollListener();
		}.bind(this);

		this._detachScrollListener();

		this.scroller.setOptions({duration: time || 0});
		this.scroller.toElement(element);
		this.scroller.addEvent('cancel:once', onEnd);
		this.scroller.addEvent('complete:once', onEnd);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {

		var wrapperSize = this.getSize();
		var contentSize = this.getScrollSize();

		if (this.options.momentum) {
			if (this.options.scrollY && contentSize.y <= wrapperSize.y) this.contentElement.setStyle('min-height', wrapperSize.y + 1);
			if (this.options.scrollX && contentSize.x <= contentSize.x) this.contentElement.setStyle('min-width',  wrapperSize.x + 1);
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getSize: function() {
		return this.contentWrapperElement.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScroll: function() {
		return this.innerWrapperElement.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.Native#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScrollSize: function() {
		return this.innerWrapperElement.getScrollSize();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_attachScrollListener: function() {
		this.innerWrapperElement.addEvent('scroll', this.bound('_onScroll'));
		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_detachScrollListener: function() {
		this.innerWrapperElement.removeEvent('scroll', this.bound('_onScroll'));
		return this;
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
	_onOrientationChange: function() {
		this.refresh();
	}

});

Moobile.Scroller.Native.supportsCurrentPlatform = function() {
	return Browser.Platform.ios && 'WebkitOverflowScrolling' in new Element('div').style;
};
