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

(function() {

var touchOverTargets = [];
var touchOutTargets = [];

Element.defineCustomEvent('touchover', {

	base: 'touchmove',

	condition: function() {
		return false;
	},

	onSetup: function() {
		touchOverTargets.include(this);
	},

	onTeardown: function() {
		touchOverTargets.erase(this);
	}

});

Element.defineCustomEvent('touchleave', {

	base: 'touchmove',

	condition: function() {
		return false;
	},

	onSetup: function() {
		touchOutTargets.include(this);
	},

	onTeardown: function() {
		touchOutTargets.erase(this);
	}
});

var onDocumentTouchMove = function(e) {

	if (touchOverTargets.length === 0 &&
		touchOutTargets.length === 0)
		return;

	var touches = e.targetTouches;
	for (var i = 0; i < touches.length; i++) {
		var touch = touches[i];
		var element = document.elementFromPoint(touch.pageX, touch.pageY);
		if (element) {
			for (var j = 0; j < touchOverTargets.length; j++) {
				var target = touchOverTargets[j];
				if (target === element || target.contains(element)) {
					target.fireEvent('touchover', e);
				}
			}
			for (var j = 0; j < touchOutTargets.length; j++) {
				var target = touchOutTargets[j];
				if (target !== element && target.contains(element) === false) {
					target.fireEvent('touchout', e);
				}
			}
		}
	}
};

window.addEvent('ready', function() {
	document.addEvent('touchmove', onDocumentTouchMove);
});

})();