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

	Roles: Moobile.ActivityIndicatorRoles,

	options: {
		className: 'activity-indicator',
		styleName: Moobile.ActivityIndicatorStyle.Default
	},

	build: function() {
		this.parent();
		this.start();
		return this;
	},

	start: function() {
		this.addClass('activity');
		return this;
	},

	pause: function() {
		this.removeClass('activity');
		return this;
	},

	center: function() {
		var wrapper = this.parentView || this.window;
		if (wrapper) {
			var wrapperSize = wrapper.content.getSize();
			var elementSize = this.element.getSize();
			var t = wrapperSize.y / 2 - elementSize.x / 2;
			var l = wrapperSize.x / 2 - elementSize.x / 2;
			this.setStyle('top', t);
			this.setStyle('left', l);
			this.setStyle('position', 'absolute');
		}
		return this;
	}

});