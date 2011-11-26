/*
---

name: ViewTransition

description: Provides the base class that applies view transition.

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

/**
 * Provides the base class that applies view transition. This class needs major
 * refactoring as it only supports animation, no transitions.
 *
 * @name ViewTransition
 * @class ViewTransition
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewTransition = new Class({

	Implements: [
		Events,
		Options,
		Chain,
		Class.Binds
	],

	/**
	 * Elements that are likely to be animated.
	 * @type {Array}
	 */
	subjects: [],

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {},

	/**
	 * Initialize the view transition.
	 * @param {Object} options The class options.
	 * @return {ViewTransition}
	 * @since 0.1
	 */
	initialize: function(options) {
		this.setOptions(options);
		return this;
	},

	/**
	 * Add an element identified with a CSS class name that is a part of the
	 * view transition.
	 * @param {Element} subject The element.
	 * @param {String} className The CSS class name.
	 * @return {ViewTransition}
	 * @since 0.1
	 */
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

	/**
	 * Remove an element from the list of subjects.
	 * @param {Element} subject The element.
	 * @return {ViewTransition}
	 * @since 0.1
	 */
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

	/**
	 * Remove all the subjects.
	 * @return {ViewTransition}
	 * @since 0.1
	 */
	removeAllSubjects: function() {
		this.subjects.each(this.bound('removeSubject'));
		this.subjects.clean();
		return this;
	},

	/**
	 * Add the final subject that will trigger the animation.
	 * @param {Element} subject The element.
	 * @param {String} className The CSS class name.
	 * @return {ViewTransition}
	 * @since 0.1
	 */
	animate: function(subject, className) {
		this.addSubject(subject, className);
		this.fireEvent('start');
		return this;
	},

	/**
	 * Override this method to define the animation used when the view enters.
	 * Always call the parent at the top of the method.
	 * @param {View} viewToShow The view to show.
	 * @param {View} viewToHide The view to hide.
	 * @param {View} parentView The view that contains both views.
	 * @param {Boolean} first Whether this is the first view to show thus no view to hide.
	 * @since 0.1
	 */
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

	/**
	 * Override this method to define the animation used when the view leaves.
	 * Always call the parent at the top of the method.
	 * @param {View} viewToShow The view to show.
	 * @param {View} viewToHide The view to hide.
	 * @param {View} parentView The view that contains both views.
	 * @param {Boolean} first Whether this is the first view to enter the parent.
	 * @since 0.1
	 */
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

	/**
	 * Called by the view transition once the enter animation completed.
	 * @param {View} viewToShow The view to show.
	 * @param {View} viewToHide The view to hide.
	 * @param {View} parentView The view that contains both views.
	 * @param {Boolean} first Whether this is the first view to enter the parent.
	 * @since 0.1
	 */
	didEnter: function(viewToShow, viewToHide, parentView, first) {

		if (viewToShow) {
			viewToShow.enable();
		}

		if (viewToHide) {
			viewToHide.hide();
			viewToHide.enable();
		}
	},

	/**
	 * Called by the view transition once the leave animation completed.
	 * @param {View} viewToShow The view to show.
	 * @param {View} viewToHide The view to hide.
	 * @param {View} parentView The view that contains both views.
	 * @param {Boolean} first Whether this is the first view to enter the parent.
	 * @since 0.1
	 */
	didLeave: function(viewToShow, viewToHide, parentView) {

		if (viewToShow) {
			viewToShow.enable();
		}

		if (viewToHide) {
			viewToHide.hide();
			viewToHide.enable();
		}
	},

	/**
	 * The animation end event.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onComplete: function(e) {

		e.stop();

		if (this.subjects.contains(e.target)) {
			this.removeAllSubjects();
			this.fireEvent('stop');
			this.fireEvent('complete');
		}
	}

});
