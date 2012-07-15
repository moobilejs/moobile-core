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

var dispatch = function(name, e) {
	var event = document.createEvent('MouseEvents');
	event.initMouseEvent(name, true, true, window, 0, e.page.x, e.page.y, e.client.x, e.client.y, false, false, false, false, 0, null);
	event.$valid = true;
	populate(event, e);
	target.dispatchEvent(event);
	return this;
};

var populate = function(dest, from) {

	var list = [{
		identifier: uniqid,
		target: target,
		pageX: from.page.x,
		pageY: from.page.y,
		clientX: from.client.x,
		clientY: from.client.y
	}];

	dest.touches = list;
	dest.targetTouches = list;
	dest.changedTouches = list;

	return this;
};

var reassign = function(dest, from) {

	dest.touches = from.touches;
	dest.targetTouches = from.targetTouches;
	dest.changedTouches = from.changedTouches;

	return this;
};

var onDocumentMouseMove = function(e) {
	if (!e.event.$valid && target) dispatch('mousemove', e);
};

var onDocumentMouseUp = function(e) {
	if (!e.event.$valid && target) dispatch('mouseup', e);
};

document.addEvent('mousemove', onDocumentMouseMove);
document.addEvent('mouseup', onDocumentMouseUp);

Element.defineCustomEvent('touchstart', {

	base: 'mousedown',

	condition: function(e) {

		if (target === null) {
			target = e.target;
			uniqid = e.event.timeStamp;
		}

		populate(e, e);

		return true;
	}
});

Element.defineCustomEvent('touchmove', {

	base: 'mousemove',

	condition: function(e) {

		if (e.event.$valid) {
			e.stop();
			reassign(e, e.event);
			return true;
		}

		return false;
	}

});

Element.defineCustomEvent('touchend', {

	base: 'mouseup',

	condition: function(e) {

		if (e.event.$valid) {
			e.stop();
			reassign(e, e.event);
			target = null;
			uniqid = null;
			return true;
		}

		return false;
	}

});

})();