/*
---

name: Scroller.Engine

description: Provides the base class for scroller engines.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventDispatcher

provides:
	- Scroller.Engine

...
*/

if (!window.Moobile) window.Moobile = {};
if (!window.Moobile.Scroller) window.Moobile.Scroller = {};

/**
 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Scroller.Engine = new Class( /** @lends Scroller.Engine.prototype */ {

	Extends: Moobile.EventDispatcher,

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#content
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	content: null,

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#wrapper
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	wrapper: null,

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		momentum: true,
		scrollX: true,
		scrollY: true,
	},

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		this.content.wraps(this.wrapper);
		this.content = null;

		this.wrapper.destroy();
		this.wrapper = null;

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	refresh: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#getContent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getContent: function() {
		return this.content;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Scroller/Scroller.Engine#getWrapper
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getWrapper: function() {
		return this.wrapper;
	}

});
