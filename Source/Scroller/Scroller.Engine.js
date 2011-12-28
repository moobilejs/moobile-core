/*
---

name: Scroller.Engine

description: Provides the base class for scroller engines.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras

provides:
	- Scroller.Engine

...
*/

if (!window.Moobile) window.Moobile = {};
if (!window.Moobile.Scroller) window.Moobile.Scroller = {};

/**
 * @name  Scroller.Engine
 * @class Provides the base class for scroller engine.
 *
 * @classdesc
 *
 * [TODO: Introduction]
 * [TODO: Events]
 * [TODO: Options]
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Scroller.Engine = new Class( /** @lends Scroller.Engine.prototype */ {

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @var    {Element} The content element.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	content: null,

	/**
	 * @var    {Element} The wrapper element.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	wrapper: null,

	/**
	 * @var    {Object} The class options.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		momentum: true,
		scrollX: true,
		scrollY: true,
	},

	/**
	 * Initializes this scroller engine.
	 *
	 * This method will creates a `wrapper` element and wrap it around the
	 * given `content` element.
	 *
	 * @param {Element}	[content] The Element, element id or string.
	 * @param {Object}  [options] The options.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(content, options) {

		content = document.id(content);

		this.setOptions(options);

		this.content = content;
		this.wrapper = new Element('div');
		this.wrapper.wraps(content);

		return this;
	},

	/**
	 * Destroys this scroller engine.
	 *
	 * This method will remove the wrapper without removing the content
	 * element.
	 *
	 * @return {Scroller.Engine} This scroller engine.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		this.content.wraps(this.wrapper);
		this.content = null;

		this.wrapper.destroy();
		this.wrapper = null;

		return this;
	},

	/**
	 * Scrolls to a set of coordinates.
	 *
	 * @param {Number} x      The x coordinate.
	 * @param {Number} y      The y coordinate.
	 * @param {Number} [time] The duration of the scroll.
	 *
	 * @return {Scroller.Engine} This scroller engine.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollTo: function(x, y, time) {
		throw new Error('You must override this method');
	},

	/**
	 * Scrolls to an element.
	 *
	 * @param {Element} element The element to scroll to.
	 * @param {Number}  [time]  The duration of the scroll.
	 *
	 * @return {Scroller.Engine} This scroller engine.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	scrollToElement: function(element, time) {
		throw new Error('You must override this method');
	},

	/**
	 * Refreshes this scroller engine.
	 *
	 * @return {Scroller} This scroller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	refresh: function() {
		throw new Error('You must override this method');
	},

	/**
	 * Returns the size.
	 *
	 * This method will return the wrapper's size as an object with two keys,
	 * `x` which indicates the width and `y` which indicates the height.
	 *
	 * @return {Object} The size.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSize: function() {
		throw new Error('You must override this method');
	},

	/**
	 * Returns the current scroll position.
	 *
	 * This method will return the current scroll position as an object
	 * with two keys, `x` which indicates the horizontal scroll and `y` which
	 * indicates the vertical scroll of this entity.
	 *
	 * @return {Object} The scroll position.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getScroll: function() {
		throw new Error('You must override this method');
	},

	/**
	 * Returns size including the scrolling area.
	 *
	 * This method will return the content's size as an object with two keys,
	 * `x` which indicates the width and `y` which indicates the height.
	 *
	 * @return {Object} The size including the scrolling area.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getScrollSize: function() {
		throw new Error('You must override this method');
	},

	/**
	 * Returns the content element.
	 *
	 * @return {Element} The content element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getContent: function() {
		return this.content;
	},

	/**
	 * Returns the wrapper element.
	 *
	 * @return {Element} The wrapper element.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getWrapper: function() {
		return this.wrapper;
	}

});
