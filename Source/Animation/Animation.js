/*
---

name: Animation

description: Provides a wrapper for a CSS animation.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Class-Extras/Class.Binds

provides:
	- Animation

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.Animation = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	element: null,

	running: false,

	styles: {
		animationName: null,
		animationDuration: null,
		animationIterationCount: null,
		animationDirection: null,
		animationTimingFunction: null,
		animationFillMode: null,
		animationDelay: null
	},

	initialize: function(element, options) {

		this.setOptions(options);

		this.element = document.id(element);
		this.element.addEvent('animationend', this.bound('onAnimationEnd'));

		return this;
	},

	setAnimationName: function(animationName) {
		this.styles.animationName = animationName;
		return this;
	},

	getAnimationName: function() {
		return this.styles.animationName;
	},

	setAnimationDuration: function(animationDuration) {
		this.styles.animationDuration = animationDuration;
		return this;
	},

	getAnimationDuration: function() {
		return this.styles.animationDuration;
	},

	setAnimationIterationCount: function(animationIterationCount) {
		this.styles.animationIterationCount = animationIterationCount;
		return this;
	},

	getAnimationIterationCount: function() {
		return this.styles.animationIterationCount;
	},

	setAnimationDirection: function(animationDirection) {
		this.styles.animationDirection = animationDirection;
		return this;
	},

	getAnimationDirection: function() {
		return this.styles.animationDirection;
	},

	setAnimationTimingFunction: function(animationTimingFunction) {
		this.styles.animationTimingFunction = animationTimingFunction;
		return this;
	},

	getAnimationTimingFunction: function() {
		return this.styles.animationTimingFunction;
	},

	setAnimationFillMode: function(animationFillMode) {
		this.styles.animationFillMode = animationFillMode;
		return this;
	},

	getAnimationFillMode: function() {
		return this.styles.animationFillMode;
	},

	setAnimationDelay: function(animationDelay) {
		this.styles.animationDelay = animationDelay;
		return this;
	},

	getAnimationDelay: function() {
		return this.styles.animationDelay;
	},

	start: function() {

		if (this.running == false) {
			this.running = true;
			this.enableStyles();
			this.fireEvent('start');
		}

		return this;
	},

	cancel: function() {

		if (this.running == false) {
			this.running = false;
			this.disableStyles();
			this.fireEvent('cancel');
		}

		return this;
	},

	isRunning: function() {
		return this.running;
	},

	enableStyles: function() {
		Object.each(this.styles, function(value, style) { this.element.setStyle('-webkit-' + style.hyphenate(), value) }, this);
		return this;
	},

	disableStyles: function() {
		Object.each(this.styles, function(value, style) { this.element.setStyle('-webkit-' + style.hyphenate(), null) }, this);
		return this;
	},

	onAnimationEnd: function(e) {

		if (!this.running || this.element !== e.target)
			return;

		this.running = false;
		this.disableStyles();
		this.fireEvent('end');
	}

});
