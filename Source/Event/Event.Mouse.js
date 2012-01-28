/*
---

name: Event.Mouse

description: Translates mouse events to touch events. This is mostly used when
             development is made on a desktop environment.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Mobile/Browser.Features.Touch

provides:
	- Event.Mouse

...
*/

if (!Browser.Features.Touch) (function() {

var fix = function(e) {
	e.targetTouches = [];
	e.changedTouches = e.touches = [{
		pageX: e.page.x,
		pageY: e.page.y,
		clientX: e.client.x,
		clientY: e.client.y
	}];
};

var mouseDown = false;

var onMouseMoveStart = function(e) {
	mouseDown = true;
};

var onMouseMoveEnd = function(e) {
	mouseDown = false;
};

Element.defineCustomEvent('touchstart', {

	base: 'mousedown',

	condition: function(e) {
		fix(e);
		return true;
	}

});

Element.defineCustomEvent('touchend', {

	base: 'mouseup',

	condition: function(e) {
		fix(e);
		return true;
	}

});

Element.defineCustomEvent('touchmove', {

	base: 'mousemove',

	condition: function(e) {
		fix(e);
		return mouseDown;
	},

	onAdd: function() {
		this.addEvent('mousedown', onMouseMoveStart);
		this.addEvent('mouseup', onMouseMoveEnd);
	},

	onRemove: function() {
		this.removeEvent('mousedown', onMouseMoveStart);
		this.removeEvent('mouseup', onMouseMoveEnd);
	}

});

})();