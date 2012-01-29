/*
---

name: Event.Mouse

description: Correctly translate the touchmove using mouse events.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Mobile/Mouse

provides:
	- Event.Mouse

...
*/

if (!Browser.Features.Touch) (function() {

var mouseDown = false;

var onMouseMoveStart = function(e) {
	mouseDown = true;
};

var onMouseMoveEnd = function(e) {
	mouseDown = false;
};

Element.defineCustomEvent('touchmove', {

	base: 'touchmove',

	condition: function(e) {

		e.targetTouches = [];
		e.changedTouches = e.touches = [{
			pageX: e.page.x,
			pageY: e.page.y,
			clientX: e.client.x,
			clientY: e.client.y
		}];

		return mouseDown;
	},

	onSetup: function() {
		this.addEvent('mousedown', onMouseMoveStart);
		this.addEvent('mouseup', onMouseMoveEnd);
	},

	onTeardown: function() {
		this.removeEvent('mousedown', onMouseMoveStart);
		this.removeEvent('mouseup', onMouseMoveEnd);
	}

});

})();