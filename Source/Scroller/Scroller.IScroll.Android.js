/*
---

name: Scroller.IScroll.Android

description: Provides a scroller that uses the iScroll scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller.IScroll

provides:
	- Scroller.IScroll.Android

...
*/


/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller.IScroll.Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Scroller.IScroll.Android = new Class({

	Extends: Moobile.Scroller.IScroll,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	loadEngine: function() {

		this.iscroll = new iScroll(this.contentWrapperElement, {
			hScroll: this.options.scrollX,
			vScroll: this.options.scrollY,
			momentum: this.options.momentum,
			bounce: false,
			hScrollbar: true,
			vScrollbar: true,
			hideScrollbar: true,
			fadeScrollbar: true,
			checkDOMChanges: true,
			scrollbarClass: 'scroll-bar-',
			onBeforeScrollStart: this.bound('_onBeforeScrollStart'),
			onAnimationEnd: this.bound('_onAnimationEnd'),
			onScrollMove: this.bound('_onScrollMove'),
			onScrollEnd: this.bound('_onScrollEnd')
		});

		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getName: function() {
		return 'iscroll-android';
	},

});

Moobile.Scroller.IScroll.Android.supportsCurrentPlatform = function() {
	return Browser.Platform.android;
};
