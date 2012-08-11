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

Class.refactor(Slider, {

	draggedKnob: function() {
		this.fireEvent('move', this.drag.value.now[this.axis]);
		this.previous();
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Control/Slider
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Slider = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_value: 0,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#slider
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	slider: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#track
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	trackElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#thumb
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	thumbElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		snap: false,
		mode: 'horizontal',
		min: 0,
		max: 100,
		background: true,
		backgroundSize: 2048,
		value: 0
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('slider');
		this.thumbElement = document.createElement('div');
		this.thumbElement.addClass('slider-thumb');
		this.trackElement = document.createElement('div');
		this.trackElement.addClass('slider-track');
		this.trackElement.grab(this.thumbElement);

		this.element.empty();
		this.element.grab(this.trackElement);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBecomeReady: function() {

		this.parent();

		var options = {
			snap: this.options.snap,
			steps: this.options.max - this.options.min,
			range: [this.options.min, this.options.max],
			mode: this.options.mode
		};

		this.slider = new Slider(this.trackElement, this.thumbElement, options);
		this.slider.addEvent('move', this.bound('_onMove'));
		this.slider.addEvent('tick', this.bound('_onTick'));
		this.slider.addEvent('change', this.bound('_onChange'));

		this.setValue(this.options.value);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this.thumbElement = null;
		this.trackElement = null;
		this.slider = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setValue: function(value) {
		this.slider.set(this._value = value);
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
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_updateTrack: function(position) {
		this.trackElement.setStyle('background-position',
			(-this.options.backgroundSize / 2) + (position + this.thumbElement.getSize().x / 2)
		);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onMove: function(position) {
		this._updateTrack(position);
		this.fireEvent('move', position);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTick: function(position) {
		this._updateTrack(position);
		this.fireEvent('tick', position);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onChange: function(step) {
		this._value = step;
		this._updateTrack(this.slider.toPosition(step));
		this.fireEvent('change', step);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('slider', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Slider, element, 'data-slider'));
});
