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
 * @edited 0.2.0
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
	 * @since  0.1.0
	 */
	_minimum: 0,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_maximum: 0,

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
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#rangeElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	rangeElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#valueElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	valueElement: null,

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
		mode: 'horizontal',
		snap: false,
		value: 0,
		minimum: 0,
		maximum: 100
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('slider');

		this.trackElement = document.createElement('div');
		this.trackElement.addClass('slider-track');
		this.trackElement.inject(this.element);

		this.thumbElement = document.createElement('div')
		this.thumbElement.addClass('slider-thumb');
		this.thumbElement.inject(this.trackElement);

		this.rangeElement = document.createElement('div');
		this.rangeElement.addClass('slider-range');
		this.rangeElement.inject(this.trackElement);

		this.valueElement = document.createElement('div');
		this.valueElement.addClass('slider-value');
		this.valueElement.inject(this.rangeElement);

		this.hitAreaElement = new Element('div.hit-area').inject(this.thumbElement);

		// <0.1 compat>
		if ('min' in this.options || 'max' in this.options) {
			console.log('[DEPRECATION NOTICE] The options "min" and "max" will be removed in 0.4, use the "minimum" and "maximum" options instead');
			if ('min' in this.options) this.options.minimum = this.options.min;
			if ('max' in this.options) this.options.maximum = this.options.max;
		}
		// </0.1 compat>

		var mode = this.options.mode;
		if (mode) {
			this.addClass('slider-mode-' + mode);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		this.element.addEvent('touchstart', this.bound('_onTouchStart'));
		this.element.addEvent('touchmove', this.bound('_onTouchMove'));
		this.element.addEvent('touchend', this.bound('_onTouchEnd'));

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
		this.setMinimum(this.options.minimum);
		this.setMaximum(this.options.maximum);
		this.setValue(this.options.value);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		this.element.removeEvent('touchstart', this.bound('_onTouchStart'));
		this.element.removeEvent('touchmove', this.bound('_onTouchMove'));
		this.element.removeEvent('touchend', this.bound('_onTouchEnd'));

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
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setMinimum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	setMinimum: function(minimum) {
		if (this._value < minimum) this.setValue(minimum);
		this._minimum = minimum;
		this.refresh();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#getMinimum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getMinimum: function() {
		return this._minimum;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setMaximum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	setMaximum: function(maximum) {
		if (this._value > maximum) this.setValue(maximum);
		this._maximum = maximum;
		this.refresh();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setMaximum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getMaximum: function() {
		return this._maximum;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#refresh
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	refresh: function() {

		var trackSize = this.trackElement.getSize();
		var thumbSize = this.thumbElement.getSize();

		var range = 0;

		switch (this.options.mode) {
			case 'horizontal':
				range = trackSize.x - thumbSize.x;
				break;
			case 'vertical':
				range = trackSize.y - thumbSize.y;
				break;
		}


		this._valueRange = this._maximum - this._minimum;
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
		this.thumbElement.setStyle('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
		this.valueElement.setStyle('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');

		this.fireEvent('change', value);

		return this;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_valueFromPosition: function(x, y) {
		return (this.options.mode === 'horizontal' ? x : y) * this._valueRange / this._trackRange + this._minimum;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_positionFromValue: function(value) {

		var x = 0;
		var y = 0;

		var pos = (value - this._minimum) * this._trackRange / this._valueRange;

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
	_onTouchStart: function(e) {
		e.stop();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchMove: function(e) {
		e.stop();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onTouchEnd: function(e) {
		e.stop();
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
