/*
---

name: Animation.Class

description: Provides a wrapper for a CSS animation that uses a CSS class.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Animation

provides:
	- Animation.Class

...
*/

Moobile.Animation.Class = new Class({

	Extends: Moobile.Animation,

	animationClass: null,

	setAnimationClass: function(animationClass) {
		this.cancel();
		this.animationClass = animationClass;
		return this;
	},

	getAnimationClass: function() {
		return this.animationClass;
	},

	enableStyles: function() {
		this.element.addClass(this.animationClass);
		return this.parent();
	},

	disableStyles: function() {
		this.element.removeClass(this.animationClass);
		return this.parent();
	}

});