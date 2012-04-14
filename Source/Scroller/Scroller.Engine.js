/*
---

name: Scroller.Engine

description: Provides the base class for scroller engines.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventFirer

provides:
	- Scroller.Engine

...
*/

if (!window.Moobile) window.Moobile = {};
if (!window.Moobile.Scroller) window.Moobile.Scroller = {};

/**
 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Scroller.Engine = new Class({

	Extends: Moobile.EventFirer,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#wrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	wrapperElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		momentum: true,
		scrollX: true,
		scrollY: true,
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(content, options) {

		content = document.id(content);

		this.setOptions(options);

		this.wrapperElement = new Element('div');
		this.wrapperElement.wraps(content);
		this.contentElement = content;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		this.contentElement.wraps(this.wrapperElement);
		this.contentElement = null;

		this.wrapperElement.destroy();
		this.wrapperElement = null;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#scrollTo
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollTo: function(x, y, time) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#scrollToElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	scrollToElement: function(element, time) {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	refresh: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#getSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSize: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#getScroll
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScroll: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#getScrollSize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getScrollSize: function() {
		throw new Error('You must override this method');
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#getContentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getContentElement: function() {
		return this.contentElement;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Scroller/Scroller.Engine#getWrapperElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getWrapperElement: function() {
		return this.wrapperElement;
	}

});
