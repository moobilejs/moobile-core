/*
---

name: Event.Rotate

description: Provides an event that indicates the window rotated.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element.Event
	- Custom-Event/Element.defineCustomEvent

provides:
	- Event.Rotate

...
*/

(function() {

if (!window.orientation) window.orientation = 0;
if (!window.orientationName) window.orientationName = 'portrait';

var orientation = function() {
	window.orientationName = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
};

Element.defineCustomEvent('rotate', {

	base: 'orientationchange',

	condition: function(e) {
		orientation();
		return true;
	}

});

orientation();

})();