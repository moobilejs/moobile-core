/*
---

name: Scroller.Engine.Native

description: Provides a native scroller engine.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller.Engine

provides:
	- Scroller.Engine.Native

...
*/


Moobile.Scroller.Engine.Native = new Class({

	Extends: Moobile.Scroller.Engine,

	options: {
		momentum: true,
		scrollX: true,
		scrollY: true
	},

	scroller: null,

	scrolling: false,

	initialize: function(content) {

		this.parent(content);

		this.wrapper.addClass('scroller-engine-native');

		if (this.options.scrollX) this.wrapper.setStyle('overflow-x', 'scroll');
		if (this.options.scrollY) this.wrapper.setStyle('overflow-y', 'scroll');

		if (this.options.momentum) {
			this.wrapper.setStyle('-webkit-overflow-scrolling', 'touch');
		}

		this.wrapper.addEvent('touchstart', this.bound('onTouchStart'));
		this.wrapper.addEvent('touchmove', this.bound('onTouchMove'));
		this.wrapper.addEvent('touchend', this.bound('onTouchEnd'));

		window.addEvent('orientationchange', this.bound('onOrientationChange'));

		this.scroller = new Fx.Scroll(this.wrapper);

		return this;
	},

	scrollTo: function(x, y, time) {

		time = time || 0;

		this.scroller.setOptions({duration: time});
		this.scroller.start(x, y);

		return this;
	},

	scrollToElement: function(element, time) {

		time = time || 0;

		element = document.id(element);

		this.scroller.setOptions({duration: time});
		this.scroller.toElement(element);

		return this;
	},

	refresh: function() {

		var wrapper = this.wrapper.getSize();
		var content = this.content.getSize();
		if (content.y <= wrapper.y) {
			this.content.setStyle('min-height', wrapper.y + 2);
		}

		return this;
	},

	getScroll: function() {
		return this.wrapper.getScroll();
	},

	destroy: function() {
		this.scroller = null;
		this.parent();
	},

	onTouchStart: function() {

		var top = this.wrapper.scrollTop;
		if (top <= 0) {
			this.wrapper.scrollTop = 1;
		}

		if (top + this.wrapper.offsetHeight + 1 >= this.wrapper.scrollHeight) {
		 	this.wrapper.scrollTop = this.wrapper.scrollHeight - this.wrapper.offsetHeight - 1;
		}

		this.scrolling = true;

		this.fireEvent('start');
	},

	onTouchMove: function() {
		if (this.scrolling) this.fireEvent('move');
	},

	onTouchEnd: function() {
		if (this.scrolling) {
			this.scrolling = false;
			this.fireEvent('end');
		}
	},

	onOrientationChange: function(e) {
		this.refresh();
	}

});
