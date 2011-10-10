/*
---

name: BarRoles

description: Provides the behavior for roles used in bar controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- BarRoles

...
*/

Moobile.BarRoles = {
	
	'bar-button': {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-class') || Moobile.BarButton;
			return Class.instanciate(c, element, o, n);
		}
	}
	
};