/*
---

name: ViewTransition

description: Provides the base class for view controller transition effects.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Element
	- Core/Element.Event
	- Core/Element.Style
	- Class-Extras/Class.Binds
	- Event.TransitionEnd

provides:
	- ViewTransition

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.ViewTransition = new Class({

	Implements: [
		Events,
		Options,
		Chain,
		Class.Binds
	],

	transitionElement: null,

	acceptedTargets: [],

	running: false,

	attachEvents: function() {
		this.transitionElement.addEvent('transitionend', this.bound('onTransitionEnd'));
		return this;
	},

	detachEvents: function() {
		this.transitionElement.removeEvent('transitionend', this.bound('onTransitionEnd'));
		return this;
	},

	setTransitionElement: function(transitionElement) {
		this.transitionElement = document.id(transitionElement);
		return this;
	},

	addAcceptedTarget: function(target) {
		target = document.id(target);
		this.acceptedTargets.include(target);
		return this;
	},

	removeAcceptedTarget: function(target) {
		target = document.id(target);
		this.acceptedTargets.erase(target);
		return this;
	},

	clearAcceptedTargets: function() {
		this.acceptedTargets = [];
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
		if (this.running == false) {
			this.running = true;
			this.addEvent('ended:once', callback);
			this.play.delay(5, this);
		}
		return this;
	},

	play: function() {
		this.running = true;
		this.attachEvents();
		this.transitionElement.addClass('commit-transition');
		return this;
	},

	onTransitionEnd: function(e) {

		if (this.running && (e.target === this.transitionElement || this.acceptedTargets.contains(e.target))) {
			this.running = false;
			this.transitionElement.removeClass('commit-transition');
			this.detachEvents();
			this.clearAcceptedTargets();
			this.fireEvent('ended');
			this.fireEvent('complete');
		}
		return this;
	}

});