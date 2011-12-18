/*
---

name: Scroller.Engine.IScroll

description: Provides a wrapper for the IScroll scroller.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Scroller.Engine

provides:
	- Scroller.Engine.IScroll

...
*/

(function() {

iScroll.prototype._currentSize = {x: 0, y: 0};

var _checkDOMChanges = iScroll.prototype._checkDOMChanges;

iScroll.prototype._checkDOMChanges = function() {

	_checkDOMChanges.call(this);

	var size = this.wrapper.getSize();
	if (this._currentSize.x != size.x || this._currentSize.y != size.y) {
		this._currentSize = size;
		this.refresh();
	}

};

})();

Moobile.Scroller.Engine.IScroll = new Class({

	Extends: Moobile.Scroller.Engine,

	initialize: function(content) {

		this.parent(content);

		this.wrapper.addClass('scroller-engine-iscroll');

		var options = {
			useTransform: true,
			useTransition: true,
			hideScrollbar: true,
			fadeScrollbar: true,
			checkDOMChanges: true,
			snap: false
		};

		this.iscroll = new iScroll(this.wrapper, options);
		this.iscroll.options.onScrollStart = this.bound('onScrollStart');
		this.iscroll.options.onScrollMove = this.bound('onScrollMove');
		this.iscroll.options.onScrollEnd = this.bound('onScrollEnd');

		return this;
	},

	destroy: function() {
		this.iscroll.destroy();
		this.parent();
		return this;
	},

	scrollTo: function(x, y, time, relative) {
		(function() { this.iscroll.scrollTo(x, y, time, relative); }).delay(5, this);
		return this;
	},

	scrollToElement: function(element, time) {
		(function() { this.iscroll.scrollToElement(element, time); }).delay(5, this);
		return this;
	},

	refresh: function() {
		this.iscroll.refresh();
		return this;
	},

	getScroll: function() {

		// TODO: I just realized this information might be found in iscroll
		// directly, I'll have to fix this instead of using "fancy"
		// regular expressions

		var x = 0;
		var y = 0;

		var position = this.content.getStyle('-webkit-transform');
		if (position) position = position.match(/translate3d\(-*(\d+)px, -*(\d+)px, -*(\d+)px\)/);
		if (position) {
			if (position[1]) x = -position[1];
			if (position[2]) y = -position[2];
		}

		return {x: x, y: y};
	},

	onScrollStart: function() {
		this.fireEvent('start');
	},

	onScrollMove: function() {
		this.fireEvent('scroll');
	},

	onScrollEnd: function() {
		this.fireEvent('end');
	}

});
