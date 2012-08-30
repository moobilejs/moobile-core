/*
---

name: Event.Mouse

description: Correctly translate mouse events to touch events.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Event.Mouse

...
*/

if (!Browser.Features.Touch) (function() {

var target = null;
var uniqid = null;

var redispatch = function(e) {

	if (e.fake)
		return;

	var faked = document.createEvent('MouseEvent');
	faked.fake = true;
	faked.initMouseEvent(
		e.type, true, true, window, 0,
    	e.screenX, e.screenY,
    	e.clientX, e.clientY,
    	false, false, false, false, 0, null);

	target.dispatchEvent(faked);
};

var onDocumentMouseDown = function(e) {
	if (target === null) {
		target = e.target;
		uniqid = e.event.timeStamp;
		redispatch(e.event);
	}
};

var onDocumentMouseMove = function(e) {
	if (target) redispatch(e.event);
};

var onDocumentMouseUp = function(e) {
	if (target) {
		redispatch(e.event);
		target = null
		uniqid = null;
	}
};

document.addEvent('mousedown', onDocumentMouseDown);
document.addEvent('mousemove', onDocumentMouseMove);
document.addEvent('mouseup', onDocumentMouseUp);

var condition = function(e) {

	var touch = {
		identifier: uniqid,
		target: target,
		pageX: e.page.x,
		pageY: e.page.y,
		clientX: e.client.x,
		clientY: e.client.y
	};

	e.touches = e.targetTouches = e.changedTouches = [touch];

	if (e.event.fake) {
		return true;
	}

	return false;
};

Element.defineCustomEvent('touchstart', {
	base: 'mousedown',
	condition: condition
});

Element.defineCustomEvent('touchmove', {
	base: 'mousemove',
	condition: condition
});

Element.defineCustomEvent('touchend', {
	base: 'mouseup',
	condition: condition
});

})();