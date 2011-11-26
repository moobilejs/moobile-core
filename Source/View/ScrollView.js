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
	- ScrollViewRoles

provides:
	- ScrollView

...
*/

/**
 * Provides a view that scrolls when its content is larger than the view area.
 *
 * @name ScrollView
 * @class ScrollView
 * @extends View
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ScrollView = new Class( /** @lends ScrollView.prototype */ {

	Extends: Moobile.View,

	/**
	 * The view content wrapper element.
	 * @type {Element}
	 */
	wrapper: null,

	/**
	 * The scroller engine.
	 * @type {Scroller}
	 */
	scroller: null,

	/**
	 * The initial scroller position.
	 * @type {Object}
	 */
	defaultContentOffset: {
		x: 0,
		y: 0
	},

	/**
	 * Scroll to an x,y coordinates.
	 * @param {Integer} x The x position.
	 * @param {Integer} y The y position.
	 * @param {Integer} time The transition time.
	 * @param {Boolean} relative Whether the coordinates are relative to the current position.
	 * @return {ScrollView}
	 * @since 0.1
	 */
	scrollTo: function(x, y, time, relative) {
		this.scroller.scrollTo(x, y, time, relative);
		return this;
	},

	/**
	 * Scroll to an element.
	 * @param {Element} element The element to scroll to.
	 * @param {Integer} time The transition time.
	 * @return {ScrollView}
	 * @since 0.1
	 */
	scrollToElement: function(element, time) {
		this.scroller.scrollToElement(element, time);
		return this;
	},

	/**
	 * Scroll to a page.
	 * @param {Integer} pageX The horizontal page.
	 * @param {Integer} pageY The vertical page.
	 * @param {Integer} time The transition tiem.
	 * @return {ScrollView}
	 * @since 0.1
	 */
	scrollToPage: function (pageX, pageY, time) {
		this.scroller.scrollToPage(pageX, pageY, time);
		return this;
	},

	/**
	 * Return the view content wrapper element.
	 * @return {Element}
	 * @since 0.1
	 */
	getWrapper: function() {
		return this.wrapper;
	},

	/**
	 * Return the scroller engine.
	 * @return {Scroller}
	 * @since 0.1
	 */
	getScroller: function() {
		return this.scroller;
	},

	/**
	 * Return the size of the content.
	 * @return {Object}
	 * @since 0.1
	 */
	getContentSize: function() {
		return this.content.getScrollSize();
	},

	/**
	 * Return the content offset.
	 * @return {Object}
	 * @since 0.1
	 */
	getContentOffset: function() {
		return this.scroller.getOffset();
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {

		this.parent();

		this.wrapper = new Element('div.wrapper');
		this.wrapper.wraps(this.content);

		if (this.options.className) {
			this.element.addClass('scroll-' + this.options.className);
			this.wrapper.addClass('scroll-' + this.options.className + '-wrapper');
		}

		this.scroller = new Moobile.Scroller(this.wrapper, this.content);

		this.scroller.addEvent('scrollstart', this.bound('onViewScrollStart'));
		this.scroller.addEvent('scrollmove', this.bound('onViewScrollMove'));
		this.scroller.addEvent('scrollend', this.bound('onViewScrollEnd'));
		this.scroller.addEvent('refresh', this.bound('onViewScrollRefresh'));
	},

	/**
	 * @see Entity#didBecomeReady
	 */
	didBecomeReady: function() {
		this.scroller.refresh();
	},

	/**
	 * @see Entity#didBecomeReady
	 */
	willHide: function() {
		this.parent();
		this.defaultContentOffset = this.scroller.getOffset();
		this.scroller.disable();
	},

	/**
	 * @see Entity#didBecomeReady
	 */
	didShow: function() {
		this.parent();
		this.scroller.enable();
		this.scroller.scrollTo(this.defaultContentOffset.x, this.defaultContentOffset.y);
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {

		this.scroller.removeEvent('scrollstart', this.bound('onViewScrollStart'));
		this.scroller.removeEvent('scrollmove', this.bound('onViewScrollMove'));
		this.scroller.removeEvent('scrollend', this.bound('onViewScrollEnd'));
		this.scroller.removeEvent('refresh', this.bound('onViewScrollRefresh'));

		this.scroller.destroy();
		this.scroller = null;
		this.wrapper = null;

		this.parent();
	},

	/**
	 * Handler for the scroll refresh event.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onViewScrollRefresh: function() {
		this.fireEvent('scrollrefresh');
	},

	/**
	 * Handler for the scroll start event.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onViewScrollStart: function() {
		this.fireEvent('scrollstart');
	},

	/**
	 * Handler for the scroll move event.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onViewScrollMove: function() {
		this.fireEvent('scrollmove');
	},

	/**
	 * Handler for the scroll end event.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onViewScrollEnd: function() {
		this.fireEvent('scrollend');
	}

});
