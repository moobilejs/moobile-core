/*
---

name: Scroller.IScroll

description: Provides a scroller that uses the iScroll scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller

provides:
	- Scroller.IScroll

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
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Scroller.IScroll = new Class({

	Extends: Moobile.Scroller,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#iscroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	iscroll: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(contentElement, contentWrapperElement, options) {

		this.parent(contentElement, contentWrapperElement, options);

		this.iscroll = new iScroll(this.contentWrapperElement, {
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
				if (target !== 'input' &&
					target !== 'select') {
					// This fixes an Android issue where the content would
					// not scroll and enable input items to be selected
					e.preventDefault();
				}
			}
		});

		window.addEvent('orientationchange', this.bound('_onOrientationChange'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	destroy: function() {
		window.removeEvent('orientationchange', this.bound('_onOrientationChange'));
		this.iscroll.destroy();
		this.iscroll = null;
		return this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getName: function() {
		return 'iscroll';
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollTo: function(x, y, time) {
		this.iscroll.refresh();
		this.iscroll.scrollTo(-x, -y, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollToElement: function(element, time) {
		this.iscroll.refresh();
		this.iscroll.scrollToElement(element, time);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {
		this.iscroll.refresh();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScroll: function() {
		return {x: -this.iscroll.x, y: -this.iscroll.y};
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getSize: function() {
		return this.contentWrapperElement.getSize();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScrollSize: function() {
		return this.contentWrapperElement.getScrollSize();
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
	_onScrollMove: function() {
		this.fireEvent('scroll');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScrollEnd: function() {
		this.fireEvent('scroll');
		this.fireEvent('scrollend');
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

Moobile.Scroller.IScroll.supportsCurrentPlatform = function() {
	return true;
};
