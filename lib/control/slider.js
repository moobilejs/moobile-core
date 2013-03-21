"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Slider = moobile.Slider = new Class({

	// TODO ajouter les importations de yannick

	Extends: moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouch: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchOffsetX: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchOffsetY: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchInitialThumbX: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__activeTouchInitialThumbY: null,

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
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#trackElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	trackElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#thumbElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	thumbElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#rangeElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	rangeElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#valueElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	valueElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#hitAreaElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	hitAreaElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#options
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

		// <deprecated>
		if ('min' in this.options || 'max' in this.options) {
			if ('min' in this.options) this.options.minimum = this.options.min;
			if ('max' in this.options) this.options.maximum = this.options.max;
			console.log('[DEPRECATION NOTICE] The options "min" and "max" will be removed in 0.4, use the "minimum" and "maximum" options instead');
		}
		// </deprecated>

		var mode = this.options.mode;
		if (mode) {
			this.addClass('slider-mode-' + mode);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		this.element.on('touchstart', this.bound('_onTouchStart'));
		this.element.on('touchmove', this.bound('_onTouchMove'));
		this.element.on('touchend', this.bound('_onTouchEnd'));

		this.thumbElement.on('touchcancel', this.bound('_onThumbTouchCancel'));
		this.thumbElement.on('touchstart', this.bound('_onThumbTouchStart'));
		this.thumbElement.on('touchmove', this.bound('_onThumbTouchMove'));
		this.thumbElement.on('touchend', this.bound('_onThumbTouchEnd'));

		this.setMinimum(this.options.minimum);
		this.setMaximum(this.options.maximum);

		var value = this.options.value;
		if (value !== null) {
			this.setValue(value);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didUpdateLayout: function() {

		this.parent();

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

		var pos = this._positionFromValue(this._value);
		if (pos.x === this._position.x &&
			pos.y === this._position.y)
			return;

		this._move(pos.x, pos.y);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		this.element.off('touchstart', this.bound('_onTouchStart'));
		this.element.off('touchmove', this.bound('_onTouchMove'));
		this.element.off('touchend', this.bound('_onTouchEnd'));

		this.thumbElement.off('touchcancel', this.bound('_onThumbTouchCancel'));
		this.thumbElement.off('touchstart', this.bound('_onThumbTouchStart'));
		this.thumbElement.off('touchmove', this.bound('_onThumbTouchMove'));
		this.thumbElement.off('touchend', this.bound('_onThumbTouchEnd'));

		this.thumbElement = null;
		this.trackElement = null;
		this.valueElement = null;
		this.rangeElement = null;

		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	setValue: function(value) {

		value = this.options.snap ? value.round() : value;

		if (this._value === value)
			return this;

		this._value = value;

		var pos = this._positionFromValue(value);
		if (pos.x !== this._position.x ||
			pos.y !== this._position.y) {
			this._move(pos.x, pos.y);
		}

		this.emit('change', value);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getValue: function() {
		return this._value;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#setMinimum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	setMinimum: function(minimum) {
		this._minimum = minimum;
		if (this._value < minimum) this.setValue(minimum);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#getMinimum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	getMinimum: function() {
		return this._minimum;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#setMaximum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	setMaximum: function(maximum) {
		this._maximum = maximum;
		if (this._value > maximum) this.setValue(maximum);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.Control/Slider#setMaximum
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	getMaximum: function() {
		return this._maximum;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	_move: function(x, y) {

		if (!this.isReady() ||
			!this.isVisible())
			return this;

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

		this._position.x = x;
		this._position.y = y;
		this.thumbElement.setStyle('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
		this.valueElement.setStyle('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');

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
		this.__activeTouch = null;
		this.__activeTouchOffsetX = null;
		this.__activeTouchOffsetY = null;
		this.__activeTouchInitialThumbX = null;
		this.__activeTouchInitialThumbY = null;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchStart: function(e) {
		var touch = e.changedTouches[0];
		if (this.__activeTouch === null) {
			this.__activeTouch = touch
			this.__activeTouchOffsetX = touch.pageX;
			this.__activeTouchOffsetY = touch.pageY;
			this.__activeTouchInitialThumbX = this._position.x;
			this.__activeTouchInitialThumbY = this._position.y;
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.2.0
	 */
	_onThumbTouchMove: function(e) {
		var touch = e.changedTouches[0];
		if (this.__activeTouch.identifier === touch.identifier) {
			var x = touch.pageX - this.__activeTouchOffsetX + this.__activeTouchInitialThumbX;
			var y = touch.pageY - this.__activeTouchOffsetY + this.__activeTouchInitialThumbY;
			this.setValue(this._valueFromPosition(x, y));
		}
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	_onThumbTouchEnd: function(e) {
		if (this.__activeTouch.identifier === e.changedTouches[0].identifier) {
			this.__activeTouch = null;
			this.__activeTouchOffsetX = null;
			this.__activeTouchOffsetY = null;
			this.__activeTouchInitialThumbX = null;
			this.__activeTouchInitialThumbY = null;
		}
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
moobile.Component.defineRole('slider', null, function(element) {
	this.addChildComponent(moobile.Component.create(Slider, element, 'data-slider'));
});
