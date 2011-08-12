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

	subjects: [],

	options: {},

	initialize: function(options) {
		this.setOptions(options);
		return this;
	},

	animate: function(subject, className) {
		this.addSubject(subject, className);
		return this;
	},

	addSubject: function(subject, className) {
		var element = document.id(subject);
		element.store('view-transition:transition-class', className);
		element.addClass(className);
		element.addEvent('transitionend', this.bound('onComplete'));
		element.addEvent('animationend', this.bound('onComplete'));
		this.subjects.push(element);
		return this;
	},

	removeSubject: function(subject) {
		var element = document.id(subject);
		var className = element.retrieve('view-transition:transition-class');
		element.removeClass(className);
		element.removeEvent('transitionend', this.bound('onComplete'));
		element.removeEvent('animationend', this.bound('onComplete'));
		this.subjects.erase(element);
		return this;
	},

	clearSubjects: function() {
		this.subjects.each(this.bound('clearSubject'));
		this.subjects = [];
		return this;
	},

	clearSubject: function(subject) {
		var className = subject.retrieve('view-transition:transition-class');
		subject.removeClass(className);
		subject.removeEvent('transitionend', this.bound('onComplete'));
		subject.removeEvent('animationend', this.bound('onComplete'));
		return this;
	},

	enter: function(viewToShow, viewToHide, parentView, first) {
		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {
		return this;
	},

	onComplete: function(e) {
		if (this.subjects.contains(e.target)) {
			this.clearSubjects();
			this.fireEvent('complete');
		}
		return this;
	}

});