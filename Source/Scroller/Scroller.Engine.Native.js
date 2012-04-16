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
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(content, options) {

		this.parent(content, options);

		this.wrapperElement.addClass('scroll-engine-native');

		this.wrapperElement.setStyle('overflow-x', this.options.scrollX ? 'scroll' : 'hidden');
		this.wrapperElement.setStyle('overflow-y', this.options.scrollY ? 'scroll' : 'hidden');
		this.wrapperElement.setStyle('-webkit-overflow-scrolling', this.options.momentum ? 'touch' : 'auto');

		this.scroller = new Fx.Scroll(this.wrapperElement);

		this.wrapperElement.addEvent('touchstart', this.bound('_onTouchStart'));
		this.wrapperElement.addEvent('touchend', this.bound('_onTouchEnd'));
		this.wrapperElement.addEvent('scroll', this.bound('_onScroll'));

		window.addEvent('rotate', this.bound('_onWindowRotate'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.Native#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		window.removeEvent('rotate', this.bound('_onWindowRotate'));
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

		var wrapperSize = this.getSize();
		var contentSize = this.getScrollSize();

		if (contentSize.y <= wrapperSize.y) {
			this.contentElement.setStyle('min-height', wrapperSize.y + 2);
		}

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
		return this.wrapperElement.getScroll();
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
	_onTouchStart: function() {

		var scroll = this.wrapperElement.getScroll();
		if (scroll.x === 0) {

			if (scroll.y <= 0) {

				// offset scroll top
				this.wrapperElement.scrollTo(0, 1);

			} else {

				// offset scroll bottom
				var totalSize = this.wrapperElement.getScrollSize();
				var frameSize = this.wrapperElement.getSize();
				if (frameSize.y + scroll.y >= totalSize.y) {
					this.wrapperElement.scrollTo(0, scroll.y - 1);
				}
			}
		}

		this.fireEvent('dragstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTouchEnd: function() {
		this.fireEvent('dragend');
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
	 * @since  0.1.0
	 */
	_onWindowRotate: function(e) {
		this.refresh();
	}

});

Moobile.Scroller.Engine.Native.supportsCurrentPlatform = function() {
	return 'WebkitOverflowScrolling' in new Element('div').style;
};
