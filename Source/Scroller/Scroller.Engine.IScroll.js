/*
---

name: Scroller.Engine.scroller

description: Provides a wrapper for the scroller scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller.Engine

provides:
	- Scroller.Engine.scroller

...
*/

(function() {

iScroll.prototype._currentSize = {x: 0, y: 0};

var _checkDOMChanges = iScroll.prototype._checkDOMChanges;

iScroll.prototype._checkDOMChanges = function() {

	_checkDOMChanges.call(this);

	var size = this.wrapper.getScrollSize();
	if (this._currentSize.x != size.x || this._currentSize.y != size.y) {
		this._currentSize = size;
		this.refresh();
	}
};

})();

/**
 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Scroller.Engine.IScroll = new Class({

	Extends: Moobile.Scroller.Engine,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouch: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#scroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scroller: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(content, options) {

		this.parent(content, options);

		this.wrapperElement.addClass('scroller-engine-iscroll');

		var options = {
			hScroll: this.options.scrollX,
			vScroll: this.options.scrollY,
			momentum: this.options.momentum,
			bounce: this.options.momentum,
			hScrollbar: this.options.momentum,
			vScrollbar: this.options.momentum,
			useTransform: true,
			useTransition: true,
			hideScrollbar: true,
			fadeScrollbar: true,
			checkDOMChanges: true,
			snap: false,
			onScrollStart: this.bound('_onScrollStart'),
			onScrollMove: this.bound('_onScrollMove'),
			onScrollEnd: this.bound('_onScrollEnd'),
			onBeforeScrollStart: function (e) {
				var target = e.target.get('tag');
				if (target !== 'input' && target !== 'select') {
					e.preventDefault();	// This fixes an Android issue where the content would not scroll
				}
			}
		};

		this.scroller = new iScroll(this.wrapperElement, options);

		window.addEvent('orientationchange', this.bound('_onOrientationChange'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		window.removeEvent('orientationchange', this.bound('_onOrientationChange'));
		this.scroller.destroy();
		this.scroller = null;
		this.parent();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		this.scroller.refresh();
		this.scroller.scrollTo(-x, -y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		this.scroller.refresh();
		this.scroller.scrollToElement(element, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	refresh: function() {
		this.scroller.refresh();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		return this.wrapperElement.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		return {x: -this.scroller.x, y: -this.scroller.y};
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine.IScroll#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		return this.contentElement.getScrollSize();
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
	 * @since  0.1.0
	 */
	_onScrollMove: function() {
		this.fireEvent('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onScrollEnd: function() {
		this.fireEvent('scroll');
		this.fireEvent('scrollend');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onOrientationChange: function() {
		this.refresh();
	}

});

Moobile.Scroller.Engine.IScroll.supportsCurrentPlatform = function() {
	return true;
};
