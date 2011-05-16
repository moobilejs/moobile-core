/*
---

name: ViewControllerTransition.Fade

description: Provide a fade-in fade-out view controller transition effect.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- ViewControllerTransition

provides:
	- ViewControllerTransition.Fade

...
*/

Moobile.ViewControllerTransition.Fade = new Class({

	Extends: Moobile.ViewControllerTransition,

	element: null,

	startup: function(viewController, viewControllerStack) {
		this.element = viewControllerStack.getViewControllerAt(1).view.getElement();
		return this.parent(viewController, viewControllerStack);
	},

	attachEvents: function() {
		this.element.addEvent('transitionend', this.bound('onTransitionComplete'));
		return this;
	},

	detachEvents: function() {
		this.element.removeEvent('transitionend', this.bound('onTransitionComplete'));
		return this;
	},

	setup: function(direction) {

		if (direction == 'enter') {
			this.element.addClass('transition-fade');
			this.element.addClass('transition-fade-enter');
			return this;
		}

		if (direction == 'leave') {
			this.element.addClass('transition-fade');
			this.element.addClass('transition-fade-leave');
			return this;
		}

		throw new Error('Unsupported direction');

		return this;
	},

	start: function(direction) {
		this.element.addClass('commit-transition');
		return this;
	},

	onTransitionComplete: function(e) {
		if (this.running && e.target == this.element) {
			this.element.removeClass('transition-fade');
			this.element.removeClass('transition-fade-enter');
			this.element.removeClass('transition-fade-leave');
			this.element.removeClass('commit-transition');
			this.complete();
		}
		return this;
	}

});