/*
---

name: Animations

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Class-Extras/Class.Binds

provides:
	- Animations

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.Animations = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	animations: {},

	currentAnimation: null,

	addAnimation: function(name, animation) {
		animation.addEvent('start', this.bound('onAnimationStart'));
		animation.addEvent('end', this.bound('onAnimationEnd'));
		this.animations[name] = animation;
		return this;
	},

	getAnimation: function(name) {
		return this.animations[name] || null;
	},

	start: function(name) {

		var animation = this.getAnimation(name);
		if (animation) {

			if (this.currentAnimation) {
				this.currentAnimation.cancel();
				this.currentAnimation = null;
			}

			this.currentAnimation = animation;
			this.currentAnimation.start();
		}

		return this;
	},

	isRunning: function() {
		return Object.some(this.animations, function(animation, name) {
			return animation.isPlaying();
		});
	},

	onAnimationStart: function(animation) {

		var name = null;
		Object.each(this.animations, function(anim, key) {
			if (name == null && animation === anim) {
				name = key;
			}
		});

		this.fireEvent('start', [animation, name]);
	},

	onAnimationEnd: function(animation) {

		if (this.currentAnimation == animation) {
			this.currentAnimation = null;

			var name = null;
			Object.each(this.animations, function(anim, key) {
				if (name == null && animation === anim) {
					name = key;
				}
			});

			this.fireEvent('end', [animation, name]);
		}
	}

});