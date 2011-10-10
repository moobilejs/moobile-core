/*
---

name: ListItemRoles

description: Provides the behavior for roles used in list item controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ListItemRoles

...
*/

Moobile.ListItemRoles = {
	
	label: {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-class') || Moobile.Label;
			return Class.instanciate(c, element, o, n);
		}
	},
	
	image: {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-class') || Moobile.Image;
			return Class.instanciate(c, element, o, n);
		}
	},
	
	accessory: {
		stop: true,
		apply: function(element) {
			element.addClass('accessory');
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-class') || Moobile.Label;
			return Class.instanciate(c, element, o, n);
		}
	},	
		
};
