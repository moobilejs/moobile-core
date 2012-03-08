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
 * @see    http://moobile.net/api/0.1/View/ScrollView
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ScrollView = new Class( /** @lends ScrollView.prototype */ {

	Extends: Moobile.View,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_scroller: null,

	/**
	 * @see    http://moobile.net/api/0.1/View/ScrollView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	wrapper: null,

	/**
	 * @see    http://moobile.net/api/0.1/View/ScrollView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		momentum: true,
		scrollX: true,
		scrollY: true,
		snapToPage: false,
		snapToPageAt: 35,
		snapToPageDuration: 150,
		snapToPageDelay: 150,
		offset: {
			x: 0,
			y: 0
		}
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('scroll-view');
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {

		this.parent();

		var options = {
			momentum: this.options.momentum,
			scrollX: this.options.scrollX,
			scrollY: this.options.scrollY,
			snapToPage: this.options.snapToPage,
			snapToPageAt: this.options.snapToPageAt,
			snapToPageDuration: this.options.snapToPageDuration,
			snapToPageDelay: this.options.snapToPageDelay
		};

		this._scroller = new Moobile.Scroller(this.contentElement, options);
		this._scroller.addEvent('dragstart', this.bound('_onDragStart'));
		this._scroller.addEvent('dragend', this.bound('_onDragEnd'));
		this._scroller.addEvent('scroll', this.bound('_onScroll'));

		this.wrapperElement = this._scroller.getWrapperElement();
		this.wrapperElement.addClass('view-content-wrapper');
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBecomeReady: function() {
		this.parent();
		this._scroller.refresh();
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._scroller.removeEvent('dragstart', this.bound('_onDragStart'));
		this._scroller.removeEvent('dragend', this.bound('_onDragEnd'));
		this._scroller.removeEvent('scroll', this.bound('_onScroll'));
		this._scroller.destroy();
		this._scroller = null;
		this.parent();
	},

	/**
	 * @see    http://moobile.net/api/0.1/View/ScrollView#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollTo: function(x, y, time) {
		this._scroller.scrollTo(x, y, time);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/View/ScrollView#scrollToPage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollToPage: function(pageX, pageY, time) {
		this._scroller.scrollToPage(pageX, pageY, time);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/View/ScrollView#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollToElement: function(element, time) {
		this._scroller.scrollToElement(element, time);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/View/ScrollView#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getScroll: function() {
		return this._scroller.getScroll();
	},

	/**
	 * @see    http://moobile.net/api/0.1/View/ScrollView#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getScrollSize: function() {
		return this._scroller.getScrollSize();
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willHide: function() {
		this.parent();
		this.options.offset = this._scroller.getScroll();
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didShow: function() {
		this.parent();
		var offset = this.options.offset;
		if (offset.x && offset.y) {
			this._scroller.scrollTo(offset.x, offset.y);
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onDragStart: function() {
		this.fireEvent('dragstart');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onDragEnd: function() {
		this.fireEvent('dragend');
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onScroll: function() {
		this.fireEvent('scroll');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('scroll-view', null, function(element) {
	var instance = Moobile.Component.create(Moobile.ScrollView, element, 'data-scroll-view');
	this.addChild(instance);
});
