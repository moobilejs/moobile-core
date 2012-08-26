/*
---

name: Slider

description: Provides a slider control with a knob.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- More/Class.Refactor
	- More/Slider
	- Control

provides:
	- Slider

...
*/


/*
---

name: Scale

description:

license:

authors:
	- Jean-Philippe Dery (jean-philippe.dery@lemieuxbedard.com)

requires:
	- Init

provides:
	- Scale

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/Slider
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Slider = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouch: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchOffsetX: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchOffsetY: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchInitialThumbX: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_activeTouchInitialThumbY: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_position: {x: -1, y: -1},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_value: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_valueRange: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_trackRange: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_trackLimit: {min: 0, max: 0},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#trackElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	trackElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#thumbElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	thumbElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#hitAreaElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	hitAreaElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	options: {
		value: 0,
		mode: 'horizontal',
		snap: false,
		min: 0,
		max: 100
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.trackElement = document.createElement('div');
		this.trackElement.addClass('slider-track');
		this.trackElement.inject(this.element);

		this.thumbElement = document.createElement('div')
		this.thumbElement.addClass('slider-thumb');
		this.thumbElement.inject(this.element);

		this.rangeElement = document.createElement('div');
		this.rangeElement.addClass('slider-range');
		this.rangeElement.inject(this.element);

		this.valueElement = document.createElement('div');
		this.valueElement.addClass('slider-value');
		this.valueElement.inject(this.rangeElement);

		this.hitAreaElement = new Element('div.hit-area').inject(this.thumbElement);

		this.element.addClass('slider');
		this.element.addClass('slider-mode-' + this.options.mode);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBuild: function() {
		this.parent();
		this.thumbElement.addEvent('touchcancel', this.bound('_onThumbTouchCancel'));
		this.thumbElement.addEvent('touchstart', this.bound('_onThumbTouchStart'));
		this.thumbElement.addEvent('touchmove', this.bound('_onThumbTouchMove'));
		this.thumbElement.addEvent('touchend', this.bound('_onThumbTouchEnd'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBecomeReady: function() {
		this.parent();
		this.refresh();
		this.setValue(this.options.value);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.thumbElement.removeEvent('touchcancel', this.bound('_onThumbTouchCancel'));
		this.thumbElement.removeEvent('touchstart', this.bound('_onThumbTouchStart'));
		this.thumbElement.removeEvent('touchmove', this.bound('_onThumbTouchMove'));
		this.thumbElement.removeEvent('touchend', this.bound('_onThumbTouchEnd'));
		this.thumbElement = null;
		this.trackElement = null;
		this.valueElement = null;
		this.rangeElement = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setValue: function(value) {
		var pos = this._positionFromValue(value);
		this._move(pos.x, pos.y);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getValue: function() {
		return this._value;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {

		var trackSize = this.trackElement.getSize();
		var thumbSize = this.thumbElement.getSize();

		var k = this.options.mode === 'horizontal' ? 'x' : 'y';

		var range = 0;
		switch (this.options.mode) {
			case 'horizontal': range = trackSize.x - thumbSize.x; break;
			case 'vertical':   range = trackSize.y - thumbSize.y; break;
		}

		this._valueRange = this.options.max - this.options.min;
		this._trackRange = range;
		this._trackLimit = {
			min: 0,
			max: range
		};

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_move: function(x, y) {

		switch (this.options.mode) {
			case 'horizontal':
				y = 0;
				if (x < this._trackLimit.min) x = this._trackLimit.min;
				if (x > this._trackLimit.max) x = this._trackLimit.max;
				break;
			case 'vertical':
				x = 0;
				if (y < this._trackLimit.min) y = this._trackLimit.min;
				if (y > this._trackLimit.max) y = this._trackLimit.max;
				break;
		}

		var value = this._valueFromPosition(x, y);

		if (this.options.snap) {
			value = value.round();
			var pos = this._positionFromValue(value);
			x = pos.x;
			y = pos.y;
		}

		if (this._position.x === x &&
			this._position.y === y) {
			return this;
		}

		this._value = value;

		this._position.x = x;
		this._position.y = y;
		this.thumbElement.setStyle('transform', 'translateX(' + x + 'px) translateY(' + y + 'px)');
		this.valueElement.setStyle('transform', 'translateX(' + x + 'px) translateY(' + y + 'px)');

		this.fireEvent('change', value);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_valueFromPosition: function(x, y) {
		return (this.options.mode === 'horizontal' ? x : y) * this._valueRange / this._trackRange + this.options.min;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_positionFromValue: function(value) {

		var x = 0;
		var y = 0;

		var pos = (value - this.options.min) * this._trackRange / this._valueRange;

		switch (this.options.mode) {
			case 'horizontal': x = pos.round(2); break;
			case 'vertical':   y = pos.round(2); break;
		}

		return {x: x, y: y};
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchCancel: function(e) {
		this._activeTouch = null;
		this._activeTouchOffsetX = null;
		this._activeTouchOffsetY = null;
		this._activeTouchInitialThumbX = null;
		this._activeTouchInitialThumbY = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchStart: function(e) {
		e.stop();
		var touch = e.changedTouches[0];
		if (this._activeTouch === null) {
			this._activeTouch = touch
			this._activeTouchOffsetX = touch.pageX;
			this._activeTouchOffsetY = touch.pageY;
			this._activeTouchInitialThumbX = this._position.x;
			this._activeTouchInitialThumbY = this._position.y;
			this._bounds = {
				min: 0,
				max: this._trackRange
			};
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchMove: function(e) {
		e.stop();
		var touch = e.changedTouches[0];
		if (this._activeTouch.identifier === touch.identifier) {
			var x = touch.pageX - this._activeTouchOffsetX + this._activeTouchInitialThumbX;
			var y = touch.pageY - this._activeTouchOffsetY + this._activeTouchInitialThumbY;
			this._move(x, y);
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchEnd: function(e) {
		e.stop();
		if (this._activeTouch.identifier === e.changedTouches[0].identifier) {
			this._activeTouch = null;
			this._activeTouchOffsetX = null;
			this._activeTouchOffsetY = null;
			this._activeTouchInitialThumbX = null;
			this._activeTouchInitialThumbY = null;
		}
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('slider', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Slider, element, 'data-slider'));
});
