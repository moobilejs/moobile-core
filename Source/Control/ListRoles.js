/*
---

name: ListRoles

description: Provides the behavior for roles used in list controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ListRoles

...
*/

Moobile.ListRoles = {
	
	'list-item': {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-list-item') || Moobile.ListItem;
			return Class.instanciate(c, element, o, n);
		}
	}	
	
};
