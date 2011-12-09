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
 * @name  Slider
 * @class Provides a slider control.
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends Control
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Slider = new Class({

	Extends: Moobile.Control,

	/**
	 * @var    {Number} This slider's value.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	value: 0,

	/**
	 * @var    {Slider} This slider' slider engine.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	slider: null,

	/**
	 * @var    {Element} This silider's track element.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	track: null,

	/**
	 * @var    {Element} This slider's thumb element.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	thumb: null,

	/**
	 * @var    {Object} The class options.
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
	 * Sets this slider's value.
	 *
	 * This method will set the slider value and move it's thumb element to the
	 * appropriate position.
	 *
	 * @param {Integer} value The value.
	 *
	 * @return {Slider} This slider.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setValue: function(value) {
		this.slider.set(this.value = value);
		return this;
	},

	/**
	 * Returns this slider's value.
	 *
	 * @return {Integer}
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getValue: function() {
		return this.value;
	},

	updateTrack: function(position) {
		this.track.setStyle('background-position',
			(-this.options.backgroundSize / 2) + (position + this.thumb.getSize().x / 2)
		);
	},

	destroy: function() {
		this.thumb = null;
		this.track = null;
		this.slider = null;
		this.parent();
	},

	willLoad: function() {

		this.parent();

		this.element.addClass('slider');

		this.thumb = new Element('div.' + this.options.className + '-thumb');
		this.track = new Element('div.' + this.options.className + '-track');
		this.track.grab(this.thumb);

		this.element.empty();
		this.element.grab(this.track);
	},

	didBecomeReady: function() {

		this.parent();

		var options = {
			snap: this.options.snap,
			steps: this.options.max - this.options.min,
			range: [this.options.min, this.options.max],
			mode: this.options.mode
		};

		this.slider = new Slider(this.track, this.thumb, options);
		this.slider.addEvent('move', this.bound('onMove'));
		this.slider.addEvent('tick', this.bound('onTick'));
		this.slider.addEvent('change', this.bound('onChange'));

		this.setValue(this.options.value);
	},

	onMove: function(position) {
		this.updateTrack(position);
		this.fireEvent('move', position);
	},

	onTick: function(position) {
		this.updateTrack(position);
		this.fireEvent('tick', position);
	},

	onChange: function(step) {
		this.value = step;
		this.updateTrack(this.slider.toPosition(step));
		this.fireEvent('change', step);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('slider', null, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-slider', Moobile.Slider);
	this.addChild(instance);
});
