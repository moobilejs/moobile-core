/*
---

name: ViewTransition

description: Provides the base class for view transitions.

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
	- Event.CSS3

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
		this.fireEvent('start');
		return this;
	},

	addSubject: function(subject, className) {

		var element = document.id(subject);
		if (element == null)
			return this;

		element.store('view-transition:transition-class', className);
		element.addClass(className);
		element.addEvent('transitionend', this.bound('onComplete'));
		element.addEvent('animationend', this.bound('onComplete'));
		this.subjects.push(element);

		return this;
	},

	removeSubject: function(subject) {

		var element = document.id(subject);
		if (element == null)
			return this;

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
		
		if (viewToShow) {
			viewToShow.show();
			viewToShow.disable();
		}
		
		if (viewToHide) {
			viewToHide.disable();
		}
		
		this.addEvent('stop:once', this.didEnter.pass([viewToShow, viewToHide, parentView, first], this));
	},

	leave: function(viewToShow, viewToHide, parentView) {
		
		if (viewToShow){
			viewToShow.show();	
			viewToShow.disable();
		} 
		
		if (viewToHide) {
			viewToHide.disable();
		}
		
		this.addEvent('stop:once', this.didLeave.pass([viewToShow, viewToHide, parentView], this));
	},

	didEnter: function(viewToShow, viewToHide, parentView, first) {

		if (viewToShow) {
			viewToShow.enable();
		}
		 
		if (viewToHide) {
			viewToHide.hide();	
			viewToHide.enable();
		}
	},

	didLeave: function(viewToShow, viewToHide, parentView) {
		
		if (viewToShow) {
			viewToShow.enable();
		}
		
		if (viewToHide) {
			viewToHide.hide();	
			viewToHide.enable();
		} 
	},

	onComplete: function(e) {
		
		e.stop();
		
		if (this.subjects.contains(e.target)) {
			this.clearSubjects();
			this.fireEvent('stop');
			this.fireEvent('complete');
		}
	}

});
