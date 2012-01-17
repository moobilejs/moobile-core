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

	Object.append(window, {

		getOrientationName: function() {
			return 	Math.abs(window.orientation) == 90 ? 'landscape' : 'portrait';
		}

	});

	var condition = function(e) {
		e.orientationName = window.getOrientationName();
		return true;
	};

	Element.defineCustomEvent('rotate', {
		base: 'orientationchange',
		condition: condition
	});

})();