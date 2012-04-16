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
 * @see    http://moobilejs.com/doc/0.1/Control/Slider
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Slider = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_value: 0,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#slider
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	slider: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#track
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	trackElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#thumb
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	thumbElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('slider');
		this.thumbElement = new Element('div.slider-thumb');
		this.trackElement = new Element('div.slider-track');
		this.trackElement.grab(this.thumbElement);

		this.element.empty();
		this.element.grab(this.trackElement);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
	 * @since  0.1
	 */
	destroy: function() {
		this.thumbElement = null;
		this.trackElement = null;
		this.slider = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setValue: function(value) {
		this.slider.set(this._value = value);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Slider#setValue
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getValue: function() {
		return this._value;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_updateTrack: function(position) {
		this.trackElement.setStyle('background-position',
			(-this.options.backgroundSize / 2) + (position + this.thumbElement.getSize().x / 2)
		);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onMove: function(position) {
		this._updateTrack(position);
		this.fireEvent('move', position);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onTick: function(position) {
		this._updateTrack(position);
		this.fireEvent('tick', position);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
