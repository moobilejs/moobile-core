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

var touch = null;
var touchTarget = null;
var touchIdentifier = null;

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

	touchTarget.dispatchEvent(faked);
};

var onDocumentMouseDown = function(e) {
	if (touch === null) {
		touchTarget = e.event.target;
		touchIdentifier = e.event.timeStamp;
		touch = {
			target: touchTarget,
			identifier: touchIdentifier
		};
		redispatch(e.event);
	}
};

var onDocumentMouseMove = function(e) {
	if (touch) redispatch(e.event);
};

var onDocumentMouseUp = function(e) {
	if (touch) {
		redispatch(e.event);
		touch = null;
		touchTarget = null;
		touchIdentifier = null;
	}
};

document.addEvent('mousedown', onDocumentMouseDown);
document.addEvent('mousemove', onDocumentMouseMove);
document.addEvent('mouseup', onDocumentMouseUp);

var condition = function(e) {

	if (touch === null)
		return false;

	touch.pageX = e.page.x;
	touch.pageY = e.page.y;
	touch.clientX = e.client.x;
	touch.clientY = e.client.y;

	e.touches = e.targetTouches = e.changedTouches = [touch];

	if (e.type === 'mouseup') {
		e.touches = [];
		e.targetTouches = [];
	}

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