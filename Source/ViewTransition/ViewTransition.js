/*
---

name: ViewTransition

description: Provides the base class for view controller transition effects.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core

provides:
	- ViewTransition

...
*/

Moobile.ViewTransition = new Class({

	Implements: [
		Events,
		Options,
		Chain,
		Class.Binds
	],

	transitionElement: null,

	running: false,

	attachEvents: function() {
		this.transitionElement.addEvent('transitionend', this.bound('end'));
		return this;
	},

	detachEvents: function() {
		this.transitionElement.removeEvent('transitionend', this.bound('end'));
		return this;
	},

	setTransitionElement: function(transitionElement) {
		this.transitionElement = document.id(transitionElement);
		return this;
	},

	getTransitionElement: function() {
		return this.transitionElement;
	},

	enter: function(viewToShow, viewToHide, parentView, firstViewIn) {
		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {
		return this;
	},

	start: function(callback) {
		this.addEvent('ended:once', callback);
		this.play.delay(5, this);
		return this;
	},

	play: function() {
		if (this.running == false) {
			this.running = true;
			this.attachEvents();
			this.transitionElement.addClass('commit-transition');
		}
	},

	end: function(e) {
		if (this.running && e.target == this.transitionElement) {
			this.running = false;
			this.transitionElement.removeClass('commit-transition');
			this.detachEvents();
			this.fireEvent('ended');
			this.fireEvent('complete');
		}
		return this;
	}

});