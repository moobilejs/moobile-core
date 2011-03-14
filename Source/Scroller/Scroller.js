/*
---

name: Scroller

description: Provide an extension of the iScroll class.

license: MIT-style license.

authors:
	- Christoph Pojer
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- Scroller

...
*/

var Scroller = function(){};
Scroller.prototype = iScroll.prototype;

Moobile.Scroller = new Class({

	Extends: Scroller,

	initialize: function(element, options){
		this.element = document.id(element);
		this.setup();
		return this;
	},

	setup: function(){
		iScroll.call(this, this.element, {
			desktopCompatibility: true,
			hScroll: false,
			vScroll: true
		});
	},

	_start: function(e) {
		this.start = e.touches ? e.touches[0].pageY : e.pageY;
		this.parent(e);
	},

	_move: function(e) {
		if (Math.abs(this.start - (e.touches ? e.touches[0].pageY : e.pageY)) > 3) Element.disableCustomEvents();
		this.parent(e);
	},

	_end: function(e) {
		(function() { Element.enableCustomEvents(); }).delay(1);
		this.parent(e);
	}

});