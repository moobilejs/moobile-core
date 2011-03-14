/*
---

name: Event.TouchIn

description: Provide a click event that is not triggered when the user clicks
             and move the mouse.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- Event.TouchIn

...
*/

(function(){

	var x = 0;
	var y = 0;
	var down = false;
	var valid = true;

	var onTouchStart = function(e) {
		x = e.page.x;
		y = e.page.y;
		down = true;
	};

	var onTouchMove = function(e) {
		if (down) {
			valid = !moved(e);
			if (valid == false) {
				this.removeEvent('touchend', onTouchEnd);
				this.fireEvent('touchend', e);
				this.addEvent('touchend', onTouchEnd);
			}
		}
	};

	var onTouchEnd = function(e) {
		if (down) {
			down = false;
			valid = !moved(e);
		}
	};

	var moved = function(e) {
		var xmax = x + 3;
		var xmin = x - 3;
		var ymax = y + 3;
		var ymin = y - 3;
		return (e.page.x > xmax || e.page.x < xmin || e.page.y > ymax || e.page.y < ymin);
	};

	Element.Events.touchin = {

		base: 'touchend',

		onAdd: function() {
			this.addEvent('touchstart', onTouchStart);
			this.addEvent('touchmove', onTouchMove);
			this.addEvent('touchend', onTouchEnd);
		},

		onRemove: function() {
			this.removeEvent('touchstart', onTouchStart);
			this.removeEvent('touchmove', onTouchMove);
			this.removeEvent('touchend', onTouchEnd);
		},

		condition: function(e) {
			return valid;
		}

	};

})();