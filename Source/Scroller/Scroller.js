/*
---

name: Scroller

description: Provides an iScroll wrapper

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

(function() {

iScroll.prototype._currentSize = {x: 0, y: 0};

var _checkDOMChanges = iScroll.prototype._checkDOMChanges;

iScroll.prototype._checkDOMChanges = function() {

	_checkDOMChanges.call(this);

	var size = this.wrapper.getSize();
	if (this._currentSize.x != size.x || this._currentSize.y != size.y) {
		this._currentSize = size;
		this.refresh();
	}

};

})();

Moobile.Scroller = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	ready: null,

	content: null,

	wrapper: null,

	scroller: null,

	size: null,

	options: {
		hideScrollbar: true,
		fadeScrollbar: true,
		checkDOMChanges: true,
		snap: false
	},

	initialize: function(wrapper, content, options) {

		this.setOptions(options);

		wrapper = document.id(wrapper);
		content = content || null;

		if (content == null) {
			content = new Element('div')
			content.ingest(wrapper);
			content.inject(wrapper);
		}

		this.content = content;
		this.wrapper = wrapper;

		this.scroller = new iScroll(this.wrapper, this.options);

		this.attachEvents();

		return this;
	},

	attachEvents: function() {
		this.options.onScrollStart = this.bound('onScrollStart');
		this.options.onScrollMove = this.bound('onScrollMove');
		this.options.onScrollEnd = this.bound('onScrollEnd');
		this.options.onRefresh = this.bound('onRefresh');
		return this;
	},

	detachEvents: function() {
		this.options.onScrollStart = null;
		this.options.onScrollMove = null;
		this.options.onScrollEnd = null;
		this.options.onRefresh = null;
		return this;
	},

	getOffset: function() {

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

	isReady: function() {
		return this.scroller.isReady();
	},

	scrollTo: function(x, y, time, relative) {
		(function() { this.scroller.scrollTo(x, y, time, relative); }).delay(5, this);
		return this;
	},

	scrollToElement: function(element, time) {
		(function() { this.scroller.scrollToElement(element, time); }).delay(5, this);
		return this;
	},

	scrollToPage: function (pageX, pageY, time) {
		(function() { this.scroller.scrollToPage(pageX, pageY, time); }).delay(5, this);
		return this;
	},

	refresh: function() {
		this.scroller.refresh();
		return this;
	},

	disable: function () {
		this.scroller.disable();
		return this;
	},

	enable: function () {
		this.scroller.enable();
		this.scroller.refresh();
		return this;
	},

	stop: function() {
		this.scroller.stop();
		return this;
	},

	destroy: function() {
		this.scroller.destroy();
		return this;
	},

	onRefresh: function() {
		this.fireEvent('refresh');
		return this;
	},

	onScrollStart: function() {
		this.fireEvent('scrollstart');
		return this;
	},

	onScrollMove: function() {
		this.fireEvent('scrollmove');
		return this;
	},

	onScrollEnd: function() {
		this.fireEvent('scrollend');
		return this;
	}

});