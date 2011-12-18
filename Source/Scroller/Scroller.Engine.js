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
 * @event onScrollStart
 * @event onScrollMove
 * @event onScrollEnd
 */
Moobile.Scroller.Engine = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	content: null,

	wrapper: null,

	initialize: function(content, options) {

		content = document.id(content);

		this.setOptions(options);

		this.content = content;
		this.wrapper = new Element('div');
		this.wrapper.wraps(content);

		this.wrapper.addClass('scrollable');

		return this;
	},

	destroy: function() {

		this.content.wraps(this.wrapper);
		this.content = null;

		this.wrapper.destroy();
		this.wrapper = null;

		return this;
	},

	scrollTo: function(x, y, time) {
		throw new Error('You must override this method');
	},

	scrollToElement: function(element, time) {
		throw new Error('You must override this method');
	},

	refresh: function() {
		throw new Error('You must override this method');
	},

	getScroll: function() {
		throw new Error('You must override this method');
	},

	getContent: function() {
		return this.content;
	},

	getWrapper: function() {
		return this.wrapper;
	}

});