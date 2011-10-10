/*
---

name: ActivityIndicatorRoles

description: Provides the behavior for roles used in activity indicator 
             controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ActivityIndicatorRoles

...
*/

Moobile.ActivityIndicatorRoles = {
	
	label: {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-label') || Moobile.Label;
			return Class.instanciate(c, element, o, n);
		}
	},

	image: {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-image') || Moobile.Image;
			return Class.instanciate(c, element, o, n);
		}
	}
		
};
