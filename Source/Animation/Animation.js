/*
---

name: Animation

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Class-Extras/Class.Binds

provides:
	- Animation

...
*/

(function() {

if (!window.Moobile) window.Moobile = {};

var styles = {
	animationName: '-webkit-animation-name',
	animationDuration: '-webkit-animation-duration',
	animationIterationCount: '-webkit-animation-iteration-count',
	animationDirection: '-webkit-animation-direction',
	animationTimingFunction: '-webkit-animation-timing-function',
	animationFillMode: '-webkit-animation-fill-mode',
	animationDelay: '-webkit-animation-delay'
};

Moobile.Animation = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	element: null,

	running: false,

	options: {
		animationName: null,
		animationDuration: null,
		animationIterationCount: null,
		animationDirection: null,
		animationTimingFunction: null,
		animationFillMode: null,
		animationDelay: null
	},

	initialize: function(element, options) {
		this.setOptions(element);
		this.element = document.id(element);
		return this;
	},

	start: function() {

		if (this.playing)
			return this;

		this.playing = true;
		this.element.addEvent('animationend', this.bound('onAnimationEnd'));
		this.enableStyles();

		return this.fireEvent('start', this);
	},

	cancel: function() {

		if (this.playing == false)
			return this;

		this.playing = false;
		this.element.removeEvent('animationend', this.bound('onAnimationEnd'));
		this.disableStyles();

		return this.fireEvent('cancel', this);
	},

	isRunning: function() {
		return this.running;
	},

	enableStyles: function() {

		Object.each(styles, function(value, style) {
			var option = this.options[style];
			if (option) this.element.setStyle(style, option);
		}, this);

		return this;
	},

	disableStyles: function() {

		Object.each(styles, function(value, style) {
			var option = this.options[style];
			if (option) this.element.setStyle(style, null);
		}, this);

		return this;
	},

	onAnimationEnd: function(e) {

		if (!this.playing || this.element !== e.target)
			return;

		this.playing = false;
		this.element.removeEvent('animationend', this.bound('onAnimationEnd'));
		this.disableStyles();

		this.fireEvent('end', this);
	}

});

})();
