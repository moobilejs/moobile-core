/*
---

name: Event.Tap

description: Provides tap, tapstart, tapmove, tapend events. Tap events use only
             one touch.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Mobile/Browser.Features.Touch
	- Event.Mouse

provides:
	- Event.Tap

...
*/

(function(){

var tapStartX = 0;
var tapStartY = 0;

var tapMaxX = 0;
var tapMinX = 0;
var tapMaxY = 0;
var tapMinY = 0;

var tapValid = true;

var onTapTouchStart = function(e) {

	if (e.changedTouches.length > 1) {
		tapValid = false;
		return;
	}

	tapValid = true;

	tapStartX = e.changedTouches[0].clientX;
	tapStartY = e.changedTouches[0].clientY;

	tapMaxX = tapStartX + 10;
	tapMinX = tapStartX - 10;
	tapMaxY = tapStartY + 10;
	tapMinY = tapStartY - 10;
};

var onTapTouchMove = function(e) {

	if (e.changedTouches.length > 1) {
		tapValid = false;
		return;
	}

	if (tapValid) {

		var x = e.changedTouches[0].clientX;
		var y = e.changedTouches[0].clientY;

		tapValid = !(x > tapMaxX || x < tapMinX || y > tapMaxY || y < tapMinY);

	} else {
		this.fireEvent('tapend', e);
	}
};

Element.defineCustomEvent('tap', {

	base: 'touchend',

	condition: function(e) {
		return tapValid;
	},

	onSetup: function() {
		this.addEvent('touchstart', onTapTouchStart);
		this.addEvent('touchmove', onTapTouchMove);
	},

	onTeardown: function() {
		this.removeEvent('touchstart', onTapTouchStart);
		this.removeEvent('touchmove', onTapTouchMove);
	}

});

Element.defineCustomEvent('tapstart', {

	base: 'touchstart',

	condition: function(e) {
		return e.changedTouches.length === 1;
	}

});

Element.defineCustomEvent('tapmove', {

	base: 'touchmove',

	condition: function(e) {
		return e.changedTouches.length === 1;
	}

});

Element.defineCustomEvent('tapend', {

	base: 'touchend',

	condition: function(e) {
		return e.changedTouches.length === 1;
	}

});

})();
