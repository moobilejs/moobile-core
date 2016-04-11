"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
var Scroller = moobile.Scroller = new Class({

	Extends: moobile.Firer,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#contentWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	contentWrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	options: {
		scroll: 'vertial',
		scrollbar: 'vertical',
		momentum: true,
		bounce: true
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(contentElement, contentWrapperElement, options) {
		this.contentElement = document.id(contentElement);
		this.contentWrapperElement = document.id(contentWrapperElement);
		this.contentWrapperElement.addClass('scrollable');
		this.setOptions(options);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	destroy: function() {
		this.contentElement = null;
		this.contentWrapperElement = null;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getName: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollTo: function(x, y, time) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	scrollToElement: function(element, time) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Scroller/Scroller#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getScroll: function() {
		throw new Error('You must override this method');
	}

});

Scroller.create = function(contentElement, contentWrapperElement, scrollers, options) {

	var scroller = null;

	scrollers = scrollers ? Array.convert(scrollers) : ['IScroll.Android', 'Native', 'IScroll'];

	for (var i = 0; i < scrollers.length; i++) {

		var candidate = Class.parse('moobile.Scroller.' + scrollers[i]);
		if (candidate === null) {
			throw new Error('The scroller scroller ' + scrollers[i] + ' does not exists');
		}

		if (candidate.supportsCurrentPlatform === undefined ||
			candidate.supportsCurrentPlatform &&
			candidate.supportsCurrentPlatform.call(this)) {
			scroller = candidate;
			break;
		}
	}

	if (scroller === null) {
		throw new Error('A proper scroller was not found');
	}

	return new scroller(contentElement, contentWrapperElement, options);
};

window.addEvent('domready', function(e) {

	var scrolls = {};

	document.addEvent('touchstart', function(e) {

		var touches = e.changedTouches;

		for (var i = 0, l = touches.length; i < l; i++) {

			var touch = touches[i];
			var target = touch.target;
			var identifier = touch.identifier;

			if (target === undefined || target.tagName === undefined || target.tagName.match(/input|textarea|select|a/i)) {
				scrolls[identifier] = false;
				return;
			}

			if (target.hasClass('scrollable') ||
				target.getParent('.scrollable')) {
				scrolls[identifier] = true;
			} else {
				scrolls[identifier] = false;
				e.preventDefault();
			}
		}
	});

	document.addEvent('touchmove', function(e) {
		var touches = e.changedTouches;
		for (var i = 0, l = touches.length; i < l; i++) {
			if (scrolls[touches[i].identifier] === false) e.preventDefault();
		}
	});

	document.addEvent('touchend', function(e) {
		var touches = e.changedTouches;
		for (var i = 0, l = touches.length; i < l; i++) {
			delete scrolls[touches[i].identifier];
		}
	});

});
