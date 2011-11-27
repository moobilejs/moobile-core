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
 * Provides a slider control with a knob.
 *
 * @name Slider
 * @class Slider
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Slider = new Class({

	Extends: Moobile.Control,

	/**
	 * The slider value.
	 * @type {Number}
	 */
	value: 0,

	/**
	 * The slider engine.
	 * @type {Slider}
	 */
	slider: null,

	/**
	 * The slider track element.
	 * @type {Element}
	 */
	track: null,

	/**
	 * The slider thumb element.
	 * @type {Element}
	 */
	thumb: null,

	/**
	 * The class options.
	 * @type {Object}
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
	 * Set the value of the slider.
	 * @param {Integer} value The value.
	 * @return {Slider}
	 * @since 0.1
	 */
	setValue: function(value) {
		this.slider.set(this.value = value);
		return this;
	},

	/**
	 * Return the value of the slider.
	 * @return {Integer}
	 * @since 0.1
	 */
	getValue: function() {
		return this.value;
	},

	/**
	 * Adjust the track background image position when the slider value changes.
	 * @param {Integer} position The slider position.
	 * @private
	 * @since 0.1
	 */
	updateTrack: function(position) {
		this.track.setStyle('background-position',
			(-this.options.backgroundSize / 2) + (position + this.thumb.getSize().x / 2)
		);
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {

		this.parent();

		this.element.addClass('slider');

		this.thumb = new Element('div.' + this.options.className + '-thumb');
		this.track = new Element('div.' + this.options.className + '-track');
		this.track.grab(this.thumb);

		this.element.empty();
		this.element.grab(this.track);
	},

	/**
	 * @see Entity#didBecomeReady
	 */
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

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.thumb = null;
		this.track = null;
		this.slider = null;
		this.parent();
	},

	/**
	 * The move event handler.
	 * @param {Integer} position The slider position.
	 * @private
	 * @since 0.1
	 */
	onMove: function(position) {
		this.updateTrack(position);
		this.fireEvent('move', position);
	},

	/**
	 * The tick event handler.
	 * @param {Integer} position The slider position.
	 * @private
	 * @since 0.1
	 */
	onTick: function(position) {
		this.updateTrack(position);
		this.fireEvent('tick', position);
	},

	/**
	 * The change event handler.
	 * @param {Integer} step The slider step.
	 * @private
	 * @since 0.1
	 */
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
