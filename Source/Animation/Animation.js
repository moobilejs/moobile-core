/*
---

name: Animation

description: Provides a wrapper for a CSS animation.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- Animation

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.Animation = new Class({

	Extends: Moobile.Entity,

	name: null,

	element: null,

	running: false,

	animationClass: null,

	animationProperties: {
		'name': null,
		'duration': null,
		'iteration-count': null,
		'animation-direction': null,
		'animation-timing-function': null,
		'animation-fill-mode': null,
		'animation-delay': null
	},

	initialize: function(element, options) {
		this.setElement(element);
		this.setOptions(options);
		return this;
	},

	setName: function(name) {
		this.name = name;
		return this;
	},

	getName: function() {
		return this.name;
	},

	setElement: function(element) {
		this.element = document.id(element);
		return this;
	},

	getElement: function() {
		return this.element;
	},

	setAnimationClass: function(value) {
		this.animationClass = value;
		return this;
	},

	getAnimationClass: function() {
		return this.animationClass;
	},

	setAnimationName: function(value) {
		this.animationProperties['name'] = value;
		return this;
	},

	getAnimationName: function() {
		return this.animationProperties['name'];
	},

	setAnimationDuration: function(value) {
		this.animationProperties['duration'] = value;
		return this;
	},

	getAnimationDuration: function() {
		return this.animationProperties['duration'];
	},

	setAnimationIterationCount: function(value) {
		this.animationProperties['iteration-count'] = value;
		return this;
	},

	getAnimationIterationCount: function() {
		return this.animationProperties['iteration-count'];
	},

	setAnimationDirection: function(value) {
		this.animationProperties['direction'] = value;
		return this;
	},

	getAnimationDirection: function() {
		return this.animationProperties['direction'];
	},

	setAnimationTimingFunction: function(value) {
		this.animationProperties['timing-function'] = value;
		return this;
	},

	getAnimationTimingFunction: function() {
		return this.animationProperties['timing-function'];
	},

	setAnimationFillMode: function(value) {
		this.animationProperties['fill-mode'] = value;
		return this;
	},

	getAnimationFillMode: function() {
		return this.animationProperties['fill-mode'];
	},

	setAnimationDelay: function(value) {
		this.animationProperties['delay'] = value;
		return this;
	},

	getAnimationDelay: function() {
		return this.animationProperties['delay'];
	},

	attach: function() {

		this.element.addEvent('animationend', this.bound('onAnimationEnd'));
		this.element.addClass(this.animationClass);

		Object.each(this.animationProperties, function(val, key) {
			this.element.setStyle('-webkit-animation-' + key, val);
		}, this);

		return this;
	},

	detach: function() {

		this.element.removeEvent('animationend', this.bound('onAnimationEnd'));
		this.element.removeClass(this.animationClass);

		Object.each(this.animationProperties, function(val, key) {
			this.element.setStyle('-webkit-animation-' + key, null);
		}, this);

		return this;
	},

	start: function() {

		if (this.running)
			return this;

		this.running = true;
		this.attach();
		this.fireEvent('start');

		return this;
	},

	stop: function() {

		if (this.running == false)
			return this;

		this.running = false;
		this.detach();
		this.fireEvent('stop');

		return this;
	},

	isRunning: function() {
		return this.running;
	},

	onAnimationEnd: function(e) {

		if (this.running == false)
			return;

		if (this.element !== e.target)
			return;

		e.stop();

		this.running = false;
		this.detach();
		this.fireEvent('end');
	}

});
