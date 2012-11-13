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

var touchid = null;

var fixtouch = function(e) {

	var touch = {
		identifier: touchid,
		target: e.target,
		pageX: e.pageX,
		pageY: e.pageY,
		clientX: e.clientX,
		clientY: e.clientY
	};

	e.touches = e.targetTouches = e.changedTouches = [touch];
};

/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Scroller.IScroll = new Class({

	Extends: Moobile.Scroller,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll#scroller
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scroller: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(contentElement, contentWrapperElement, options) {

		this.parent(contentElement, contentWrapperElement, options)

		this.scroller = new iScroll(contentWrapperElement, {
			scrollbarClass: 'scrollbar-',
			hScroll: this.options.scroll === 'both' || this.options.scroll === 'horizontal',
			vScroll: this.options.scroll === 'both' || this.options.scroll === 'vertical',
			hScrollbar: this.options.scrollbar === 'both' || this.options.scrollbar === 'horizontal',
			vScrollbar: this.options.scrollbar === 'both' || this.options.scrollbar === 'vertical',
			momentum: this.options.momentum,
			bounce: this.options.bounce,
			hideScrollbar: true,
			fadeScrollbar: true,
			checkDOMChanges: true,
			onBeforeScrollStart: this.bound('_onBeforeScrollStart'),
			onScrollStart: this.bound('_onScrollStart'),
			onScrollMove: this.bound('_onScrollMove'),
			onScrollEnd: this.bound('_onScrollEnd'),
			onTouchEnd: this.bound('_onTouchEnd')
		});

		window.addEvent('resize', this.bound('refresh'));

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	destroy: function() {
		window.removeEvent('resize', this.bound('refresh'));
		this.scroller.destroy();
		this.scroller = null;
		return this.parent();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getName: function() {
		return 'iscroll';
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollTo: function(x, y, time) {
		this.scroller.scrollTo(-x, -y, time || 0);
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollToElement: function(element, time) {
		this.scroller.scrollToElement(document.id(element), time || 0);
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {
		this.scroller.refresh();
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScroll: function() {
		return {
			x: -this.scroller.x,
			y: -this.scroller.y
		};
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onBeforeScrollStart: function(e) {
		var target = e.target.get('tag');
		if (target !== 'input' &&
			target !== 'select' &&
			target !== 'textarea') {
			e.preventDefault();
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScrollStart: function(e) {

		if (!('touches' in e)) {

			if (touchid)
				return this;

			if (touchid === null) {
				touchid = String.uniqueID();
				fixtouch(e);
			}
		}


		this.fireEvent('touchstart', e);
		this.fireEvent('scrollstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onScrollMove: function(e) {

		if (touchid) {
			fixtouch(e);
		}

		this.fireEvent('touchmove', e);
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
	_onTouchEnd:  function(e) {

		if (touchid) {
			fixtouch(e);
			touchid = null;
		}

		this.fireEvent('touchend', e);
	}

});

Moobile.Scroller.IScroll.supportsCurrentPlatform = function() {
	return true;
};

})();