/*
---

name: Event.Click

description: Provides a click event that is not triggered when the user clicks
             and moves the mouse. This overrides the default click event. It's
             important to include Mobile/Click before this class otherwise the
             click event will be deleted.

license: MIT-style license.

author:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Event
	- Core/Element.Event
	- Event.Mobile

provides:
	- Event.Click

...
*/

(function(){

	var x = 0;
	var y = 0;
	var down = false;
	var valid = true;

	var onMouseDown = function(e) {

		valid = true;
		down = true;

		x = e.client.x;
		y = e.client.y;
	};

	var onMouseMove = function(e) {

		if (down) {
			if (valid) valid = !moved(e);
			if (!valid) {
				this.removeEvent('mouseup', onMouseUp).fireEvent('mouseup', e).addEvent('mouseup', onMouseUp);
			}
		}
	};

	var onMouseUp = function(e) {

		if (down) {
			down = false;
		}
	};

	var moved = function(e) {

		var xmax = x + 10;
		var xmin = x - 10;
		var ymax = y + 10;
		var ymin = y - 10;

		var xcur = e.client.x;
		var ycur = e.client.y;

		return (xcur > xmax || xcur < xmin || ycur > ymax || ycur < ymin);
	};

	Element.defineCustomEvent('click', {

		base: 'click',

		onAdd: function() {
			this.addEvent('mousedown', onMouseDown);
			this.addEvent('mousemove', onMouseMove);
			this.addEvent('mouseup', onMouseUp);
		},

		onRemove: function() {
			this.removeEvent('mousedown', onMouseDown);
			this.removeEvent('mousemove', onMouseMove);
			this.removeEvent('mouseup', onMouseUp);
		},

		condition: function(e) {
			return valid;
		}

	});

})();
