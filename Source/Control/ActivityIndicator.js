/*
---

name: ActivityIndicator

description: Provides a control that indicates activities when animated.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ActivityIndicator

...
*/

/**
 * Provides a control that indicates activities when animated.
 *
 * @name ActivityIndicator
 * @class ActivityIndicator
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ActivityIndicator = new Class( /* @lends ActivityIndicator.prototype */ {

	Extends: Moobile.Control,

	/**
	 * Start the activity indicator animation.
	 * @return {ActivityIndicator}
	 * @since 0.1
	 */
	start: function() {
		this.addClass('activity');
		return this;
	},

	/**
	 * Start the activity indicator animation.
	 * @return {ActivityIndicator}
	 * @since 0.1
	 */
	stop: function() {
		this.removeClass('activity');
		return this;
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {
		this.parent();
		this.element.addClass('activity-indicator');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('activity-indicator', null, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-activity-indicator', Moobile.ActivityIndicator);
	this.addChild(instance);
});
