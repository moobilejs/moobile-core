/*
---

name: Event.Mobile

description: Correctly translate mouse events to touch events.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element.Event
	- Custom-Event/Element.defineCustomEvent
	- Mobile/Browser.Mobile
	- Mobile/Click
	- Mobile/Touch
	- Mobile/Pinch
	- Mobile/Swipe

provides:
	- Event.Mobile

...
*/

if (Browser.isMobile) (function() {

	delete Element.NativeEvents['mousedown'];
	delete Element.NativeEvents['mousemove'];
	delete Element.NativeEvents['mouseup'];

	var condition = function(e) {

		var touch = e.changedTouches[0];

		e.page   = {x:touch.pageX,   y:touch.pageY};
		e.client = {x:touch.clientX, y:touch.clientY};

		return true;
	};

	Element.defineCustomEvent('mousedown', {
		base: 'touchstart',
		condition: condition
	});

	Element.defineCustomEvent('mousemove', {
		base: 'touchmove',
		condition: condition
	});

	Element.defineCustomEvent('mouseup', {
		base: 'touchend',
		condition: condition
	});

})();
