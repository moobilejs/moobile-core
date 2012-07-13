/*
---

name: Event.Mouse

description: Correctly translate mouse events to touch events.

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

delete Element.NativeEvents['touchstart'];
delete Element.NativeEvents['touchmove'];
delete Element.NativeEvents['touchend'];

var listeners = {
	'touchstart': [],
	'touchmove': [],
	'touchend': []
};

var target = null;
var down = false;

var onMouseDown = function(e) {
	down = true;
	target = e.target;
	dispatch('touchstart', target, e);
};

var onMouseMove = function(e) {
	if (down) dispatch('touchmove', target, e);
};

var onMouseUp = function(e) {
	dispatch('touchend', target, e);
	target = null;
	down = false;
};

var dispatch = function(name, target, event) {
	listeners[name].each(function(element) {
		if (element === target || element.contains(target)) {
			event.targetTouches = event.changedTouches = event.touches = [{
				identifier: String.uniqueID(),
				target: target,
				pageX: event.page.x,
				pageY: event.page.y,
				clientX: event.client.x,
				clientY: event.client.y
			}];
			element.fireEvent(name, event);
		}
	});
};

var listen = function(event) {
	return function() {
		listeners[event].include(this);
	}
};

var ignore = function(event) {
	return function() {
		listeners[event].erase(this);
	}
};

document.addEvent('mousedown', onMouseDown);
document.addEvent('mousemove', onMouseMove);
document.addEvent('mouseup', onMouseUp);
document.addEvent('mouseleave', onMouseUp);

Element.defineCustomEvent('touchstart', {
	onSetup: listen('touchstart'),
	onTeardown: ignore('touchstart')
}).defineCustomEvent('touchmove', {
	onSetup: listen('touchmove'),
	onTeardown: ignore('touchmove')
}).defineCustomEvent('touchend', {
	onSetup: listen('touchend'),
	onTeardown: ignore('touchend')
});

})();