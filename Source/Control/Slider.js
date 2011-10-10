/*
---

name: Slider

description: Provides a Slider control.

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

Moobile.Slider = new Class({

	Extends: Moobile.Control,

	value: 0,

	slider: null,

	track: null,

	thumb: null,

	options: {
		className: 'slider',
		snap: false,
		mode: 'horizontal',
		min: 0,
		max: 100,
		background: true,
		backgroundSize: 2048,
		value: 0
	},

	build: function(element) {

		this.parent(element);

		this.thumb = new Element('div.' + this.options.className + '-thumb');
		this.track = new Element('div.' + this.options.className + '-track');
		this.track.grab(this.thumb);

		this.content.empty();
		this.content.grab(this.track);

		return this;
	},

	setValue: function(value) {
		this.slider.set(this.value = value);
		return this;
	},

	getValue: function() {
		return this.value;
	},

	setup: function() {
		this.parent();
		this.attachSlider();
		this.setValue(this.options.value);
		return this;
	},

	teardown: function() {
		this.detachSlider();
		this.thumb = null;
		this.parent();
		return this;
	},

	attachSlider: function() {

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

		return this;
	},

	detachSlider: function() {
		this.slider = null;
		return this;
	},

	updateTrack: function(position) {
		this.track.setStyle('background-position',
			(-this.options.backgroundSize / 2) + (position + this.thumb.getSize().x / 2)
		);
		return this;
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