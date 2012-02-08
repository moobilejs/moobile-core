/*
---

name: Animation.Set

description: Provides a container for multiple animations.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Animation

provides:
	- Animation.Set

...
*/

Moobile.Animation.Set = new Class({

	Extends: Moobile.Animation,

	name: null,

	element: null,

	animations: [],

	currentAnimation: null,

	initialize: function(element, options) {

		this.parent(element, options);

		delete this.running;
		delete this.animationClass;
		delete this.animationProperties;

		return this;
	},

	setAnimation: function(name, animation) {

		animation.setName(name);
		animation.setOptions(this.options);

		this.removeAnimation(name);

		animation.addEvent('start', this.bound('onAnimationStart'));
		animation.addEvent('stop', this.bound('onAnimationStop'));
		animation.addEvent('end', this.bound('onAnimationEnd'));

		if (this.element) {
			animation.setElement(this.element);
		}

		this.animations.include(animation);

		return this;
	},

	getAnimation: function(name) {
		return this.animations.find(function(animation) {
			return animation.getName() === name;
		});
	},

	removeAnimation: function(name) {

		var animation = this.getAnimation(name);
		if (animation) {
			animation.cancel();
			animation.removeEvent('start', this.bound('onAnimationStart'));
			animation.removeEvent('stop', this.bound('onAnimationStop'));
			animation.removeEvent('end', this.bound('onAnimationEnd'));

			if (this.currentAnimation === animation) {
				this.currentAnimation = null;
			}

			this.animations.erase(animation);

			animation = null;
		}

		return this;
	},

	setElement: function(element) {
		this.element = document.id(element);
		this.animations.invoke('setElement', this.element);
		return this;
	},

	getElement: function() {
		return this.animations.invoke('getElement');
	},

	setAnimationClass: function(value) {
		this.animations.invoke('setAnimationClass', value);
		return this;
	},

	getAnimationClass: function() {
		return this.animations.invoke('getAnimationClass');
	},

	setAnimationName: function(value) {
		this.animations.invoke('setAnimationName', value);
		return this;
	},

	getAnimationName: function() {
		return this.animations.invoke('getAnimationName');
	},

	setAnimationDuration: function(value) {
		this.animations.invoke('setAnimationDuration', value);
		return this;
	},

	getAnimationDuration: function() {
		return this.animations.invoke('getAnimationDuration');
	},

	setAnimationIterationCount: function(value) {
		this.animations.invoke('setAnimationIterationCount', value);
		return this;
	},

	getAnimationIterationCount: function() {
		return this.animations.invoke('getAnimationIterationCount');
	},

	setAnimationDirection: function(value) {
		this.animations.invoke('setAnimationDirection', value);
		return this;
	},

	getAnimationDirection: function() {
		return this.animations.invoke('getAnimationDirection');
	},

	setAnimationTimingFunction: function(value) {
		this.animations.invoke('setAnimationTimingFunction', value);
		return this;
	},

	getAnimationTimingFunction: function() {
		return this.animations.invoke('getAnimationTimingFunction');
	},

	setAnimationFillMode: function(value) {
		this.animations.invoke('setAnimationFillMode', value);
		return this;
	},

	getAnimationFillMode: function() {
		return this.animations.invoke('getAnimationFillMode');
	},

	setAnimationDelay: function(value) {
		this.animations.invoke('setAnimationDelay', value);
		return this;
	},

	getAnimationDelay: function() {
		return this.animations.invoke('getAnimationDelay');
	},

	attach: function() {
		this.animations.invoke('attach');
		return this;
	},

	detach: function() {
		this.animations.invoke('detach');
		return this;
	},

	start: function(name) {

		this.stop();

		var animation = this.getAnimation(name);
		if (animation) {
			this.currentAnimation = animation;
			this.currentAnimation.start();
		}

		return this;
	},

	stop: function() {

		if (this.currentAnimation) {
			this.currentAnimation.stop()
			this.currentAnimation = null;
		}

		return this;
	},

	isRunning: function() {
		return this.animations.some(function(animation) {
			return animation.isRunning();
		});
	},

	onAnimationStart: function() {
		this.fireEvent('start', this.currentAnimation);
	},

	onAnimationStop: function() {
		this.fireEvent('stop', this.currentAnimation);
	},

	onAnimationEnd: function() {
		this.fireEvent('end', this.currentAnimation);
		this.currentAnimation = null;
	},

});
