/*
---

name: ViewPanelRoles

description: Provides the behavior for roles used inside a view panel view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- ViewPanelRoles

...
*/

Moobile.ViewPanelRoles = {

	'side-panel': {
		stop: false,
		apply: function(element) {
			return element.addClass('side-panel');
		}
	},
	
	'main-panel': {
		stop: false,
		apply: function(element) {
			return element.addClass('main-panel');
		}	
	}

};