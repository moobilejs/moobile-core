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

	setValue: function(value) {
		this.slider.set(this.value = value);
		return this;
	},

	getValue: function() {
		return this.value;
	},

	updateTrack: function(position) {
		this.track.setStyle('background-position',
			(-this.options.backgroundSize / 2) + (position + this.thumb.getSize().x / 2)
		);
	},

	didLoad: function() {

		this.parent();

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

	destroy: function() {
		this.thumb = null;
		this.track = null;
		this.slider = null;
		this.parent();		
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
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('slider', null, function(element, name) {
	
	var instance = Class.instantiate(element.get('data-slider') || Moobile.Slider, element, null, name);
	if (instance instanceof Moobile.Slider) {
		this.addChild(instance);
	}	
	
	return instance;
});
