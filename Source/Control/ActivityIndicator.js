/*
---

name: ActivityIndicator

description: Provide an activity indicator.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- ActivityIndicatorRoles
	- ActivityIndicatorStyle

provides:
	- ActivityIndicator

...
*/

Moobile.ActivityIndicator = new Class({

	Extends: Moobile.Control,

	options: {
		className: 'activity-indicator'
	},

	start: function() {
		this.addClass('activity');
		return this;
	},

	pause: function() {
		this.removeClass('activity');
		return this;
	}

});

/**
 * @role activity-indicator
 */
Moobile.Entity.defineRole('activity-indicator', null, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-activity-indicator') || Moobile.ActivityIndicator, element, options, name);
	if (instance instanceof Moobile.ActivityIndicator) {
		this.addChild(instance);
	}
	
	return instance;	
});