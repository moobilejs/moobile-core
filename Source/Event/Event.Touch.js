/*
---

name: Event.Touch

description: Provides several touch events.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Mobile/Browser.Features.Touch
	- Event.Mouse

provides:
	- Event.Touch

...
*/

if (Browser.Features.Touch) (function() {

// This fixes stuff that still uses mouse events such as Drag.Move

delete Element.NativeEvents['mousedown'];
delete Element.NativeEvents['mousemove'];
delete Element.NativeEvents['mouseup'];

Element.defineCustomEvent('mousedown', {

	base: 'touchstart',

}).defineCustomEvent('mousemove', {

	base: 'touchmove'

}).defineCustomEvent('mouseup', {

	base: 'touchend',

});

})();
