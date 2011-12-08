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
 * @name      ActivityIndicator
 * @class     Provides a control that indicates activity when animated.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ActivityIndicator = new Class( /* @lends ActivityIndicator.prototype */ {

	Extends: Moobile.Control,

	/**
	 * Start the activity indicator animation.
	 *
	 * This method will start the indicator animation by adding the `activity`
	 * CSS class to the element. Update the CSS properties of this class to
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
	 * CSS class to the element. Update the CSS properties of this class to
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

	/**
	 * Add the proper CSS classes to the activity indicator's element once
	 * it's been correctly loaded.
	 *
	 * @see Entity#didLoad
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
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
