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
 * @name  ActivityIndicator
 * @class Provides an activity indicator control.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ActivityIndicator = new Class( /** @lends ActivityIndicator.prototype */ {

	Extends: Moobile.Control,

	/**
	 * Start the activity indicator animation.
	 *
	 * This method will start the indicator animation by adding the `activity`
	 * CSS class to the element. Update the properties of this CSS class to
	 * customize the animation.
	 *
	 * @return {ActivityIndicator} This activity indicator.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	start: function() {
		return this.addClass('activity');
	},

	/**
	 * Stop the activity indicator animation.
	 *
	 * This method will stop the indicator animation by removing the `activity`
	 * CSS class to the element. Update the properties of this CSS class to
	 * customize the animation.
	 *
	 * @return {ActivityIndicator} This activity indicator.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	stop: function() {
		return this.removeClass('activity');
	},

	willBuild: function() {
		this.parent();
		this.element.addClass('activity-indicator');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('activity-indicator', null, function(element) {
	var instance = Moobile.Component.fromElement(element, 'data-activity-indicator', Moobile.ActivityIndicator);
	this.addChild(instance);
});
