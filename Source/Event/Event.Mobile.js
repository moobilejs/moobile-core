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

provides:
	- Event.Mobile

...
*/

if (Browser.isMobile) {

	delete Element.NativeEvents['mousedown'];
	delete Element.NativeEvents['mousemove'];
	delete Element.NativeEvents['mouseup'];

	Element.defineCustomEvent('mousedown', {
		base: 'touchstart'
	});

	Element.defineCustomEvent('mousemove', {
		base: 'touchmove'
	});

	Element.defineCustomEvent('mouseup', {
		base: 'touchend'
	});

}