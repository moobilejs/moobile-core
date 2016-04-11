"use strict"

var tapValid = true;
var tapTouch = null;

var onTapTouchStart = function(e) {
	tapTouch = e.changedTouches[0]
	tapValid = true;
};

var onTapTouchCancel = function(e) {
	tapValid = false;
};

Element.defineCustomEvent('tap', {

	base: 'touchend',

	condition: function(e) {

		if (tapValid) {

			var element = tapTouch ? document.elementFromPoint(tapTouch.pageX, tapTouch.pageY) : null;
			if (element) {
				return this === element || this.contains(element);
			}

			return false;
		}

		return tapValid;
	},

	onSetup: function() {
		this.addEvent('touchcancel', onTapTouchCancel);
		this.addEvent('touchstart', onTapTouchStart);
	},

	onTeardown: function() {
		this.removeEvent('touchcancel', onTapTouchCancel);
		this.removeEvent('touchstart', onTapTouchStart);
	}

});

// pasmal de truc à réfléchir avec ça...

Element.defineCustomEvent('tapstart', {

	base: 'touchstart',

	condition: function(e) {
		return e.touches.length === 1;
	}

});

Element.defineCustomEvent('tapmove', {

	base: 'touchmove',

	condition: function(e) {
		return e.touches.length === 1;
	}

});

Element.defineCustomEvent('tapend', {

	base: 'touchend',

	condition: function(e) {
		return e.touches.length === 0;
	}

});

Element.defineCustomEvent('tapcancel', {
	base: 'touchcancel',
});
