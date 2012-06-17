/*
---

name: Scroller.Engine.Native

description: Provides a native scroller engine.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller.Engine

provides:
	- Scroller.Engine.Native

...
*/

/**
 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Scroller.Engine.Native = new Class({

	Extends: Moobile.Scroller.Engine,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouch: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#scroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scroller: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#scrolling
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrolling: false,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#outerElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	outerElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#innerElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	innerElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(content, options) {

		this.parent(content, options);

		this.wrapperElement.addClass('scroller-engine-native');

		var scrollable = this.wrapperElement;

		if (this.options.momentum) {

			this.innerElement = new Element('div.scroller-engine-native-inner');
			this.outerElement = new Element('div.scroller-engine-native-outer');
			this.innerElement.wraps(this.contentElement);
			this.outerElement.wraps(this.innerElement);

			scrollable = this.innerElement;

			if (this.options.scrollX) this.contentElement.setStyle('margin-right', '-1px');
			if (this.options.scrollY) this.contentElement.setStyle('margin-bottom', '-1px');
		}

		this.scroller = new Fx.Scroll(scrollable);

		this.wrapperElement.addEvent('touchcancel', this.bound('_onTouchCancel'));
		this.wrapperElement.addEvent('touchstart', this.bound('_onTouchStart'));
		this.wrapperElement.addEvent('touchmove', this.bound('_onTouchMove'));
		this.wrapperElement.addEvent('touchend', this.bound('_onTouchEnd'));
		this.wrapperElement.addEvent('scroll', this.bound('_onScroll'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.wrapperElement.removeEvent('touchcancel', this.bound('_onTouchCancel'));
		this.wrapperElement.removeEvent('touchstart', this.bound('_onTouchStart'));
		this.wrapperElement.removeEvent('touchmove', this.bound('_onTouchMove'));
		this.wrapperElement.removeEvent('touchend', this.bound('_onTouchEnd'));
		this.wrapperElement.removeEvent('scroll', this.bound('_onScroll'));
		this.scroller = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {

		time = time || 0;

		this.scroller.setOptions({duration: time});
		this.scroller.start(x, y);
		// TODO: proper events
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {

		time = time || 0;

		element = document.id(element);

		this.scroller.setOptions({duration: time});
		this.scroller.toElement(element);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	refresh: function() {
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		return this.wrapperElement.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		return this.innerElement.getScroll();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		return this.contentElement.getScrollSize();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTouchStart: function(e) {
		if (this._activeTouch === null) {
			this._activeTouch = e.changedTouches[0];
			this.fireEvent('dragstart'); // Deprecated 0.2
			this.fireEvent('scrollstart');
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchMove: function(e) {

	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTouchEnd: function(e) {
		if (this._activeTouch &&
			this._activeTouch.identifier === e.changedTouches[0].identifier) {
			this._activeTouch = null;
			this.fireEvent('dragend'); // Deprecated 0.2
			this.fireEvent('scrollend');
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchCancel: function(e) {
		this._activeTouch = null;
		this.fireEvent('dragend'); // Deprecated 0.2
		this.fireEvent('scrollend');
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

Moobile.Scroller.Engine.Native.supportsCurrentPlatform = function() {
	return Browser.Platform.ios && 'WebkitOverflowScrolling' in new Element('div').style;
};
