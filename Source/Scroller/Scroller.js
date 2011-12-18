/*
---

name: Scroller

description: Provides a wrapper for the iScroll scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Class.Mutator.Property

provides:
	- Scroller

...
*/

Moobile.Scroller = new Class( /** @lends Scroller.prototype */ {

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	engine: null,

	options: {
		engine: 'Native'
	},

	initialize: function(content, options) {

		this.setOptions(options);

		// TODO: Add an option to autodetect the proper engine

		var engine = Moobile.Scroller.Engine[this.options.engine];
		if (engine == undefined) {
			throw new Error('The scroller engine ' + engine + ' does not exists');
		}

		this.engine = new engine(content);

		return this;
	},

	scrollTo: function(x, y, time) {
		this.engine.scrollTo(x, y, time);
		return this;
	},

	scrollToElement: function(element, time) {
		this.engine.scrollToElement(element, time);
		return this;
	},

	refresh: function() {
		this.engine.refresh();
		return this;
	},

	getScroll: function() {
		return this.engine.getScroll();
	},

	getContent: function() {
		return this.engine.getContent();
	},

	getWrapper: function() {
		return this.engine.getWrapper();
	},

	destroy: function() {
		this.engine.destroy();
		this.engine = null;
		return this;
	}

});

(function() {

window.addEvent('domready', function(e) {
	document.addEvent('touchmove', function(e) {
		if (!e.target.getParent('.scrollable')) e.preventDefault();
	});
});

})();
