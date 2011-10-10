/*
---

name: ViewRoles

description: Provides the behavior for roles used inside views.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- ViewRoles

...
*/

Moobile.ViewRoles = {

	content: {
		stop: false,
		apply: function(element) {
			return element.addClass('content');
		}
	},

	view: {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-class') || Moobile.View;
			return Class.instanciate(c, element, o, n);
		}
	},

	control: {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-class') || Moobile.Control;
			return Class.instanciate(c, element, o, n);
		}
	}
};