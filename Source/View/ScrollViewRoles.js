/*
---

name: ScrollViewRoles

description: Provides the behavior for roles used inside scroll views.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ScrollViewRoles

...
*/

Moobile.ScrollViewRoles = {

	wrapper: {
		stop: false,
		apply: function(element) {
			return element.addClass('wrapper');
		}
	}
};