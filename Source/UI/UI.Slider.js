/*
---

name: UI.Slider

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- More/Class.Refactor
	- More/Slider
	- UI.Control

provides:
	- UI.Slider

...
*/

Class.refactor(Slider, {

	draggedKnob: function() {
		this.fireEvent('move', this.drag.value.now[this.axis]);
		this.previous();
	}

});

Moobile.UI.Slider = new Class({

	Extends: Moobile.UI.Control,

	slider: null,

	trackElement: null,

	handleElement: null,

	options: {
		className: 'ui-slider',
		snap: false,
		mode: 'horizontal',
		min: 0,
		max: 100,
		background: true,
		backgroundSize: 2048
	},

	build: function() {
		this.parent();
		this.buildTrackElement();
		this.buildHandleElement();
		return this;
	},

	buildTrackElement: function() {
		this.trackElement = new Element('div.' + this.options.className + '-track');
		this.trackElement.inject(this.element);
		return this;
	},

	buildHandleElement: function() {
		this.handleElement = new Element('div.' + this.options.className + '-handle');
		this.handleElement.inject(this.trackElement);
		return this;
	},

	init: function() {
		this.attachSlider();
		this.set(this.options.min);
		this.parent();
		return this;
	},

	release: function() {
		this.detachSlider();
		this.handleElement = null;
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

		this.slider = new Slider(this.trackElement, this.handleElement, options);

		this.slider.addEvent('move', this.bound('onMove'));
		this.slider.addEvent('tick', this.bound('onTick'));
		this.slider.addEvent('change', this.bound('onChange'));

		return this;
	},

	detachSlider: function() {
		this.slider = null;
		return this;
	},

	set: function(step) {
		this.slider.set(step);
		return this;
	},

	adjustBackground: function(position) {
		this.trackElement.setStyle('background-position',
			(-this.options.backgroundSize / 2) + (position + this.handleElement.getSize().x / 2)
		);
		return this;
	},

	onMove: function(position) {
		this.adjustBackground(position);
		this.fireEvent('move', position);
	},

	onTick: function(position) {
		this.adjustBackground(position);
		this.fireEvent('tick', position);
	},

	onChange: function(step) {
		this.adjustBackground(this.slider.toPosition(step));
		this.fireEvent('change', step);
	}

});