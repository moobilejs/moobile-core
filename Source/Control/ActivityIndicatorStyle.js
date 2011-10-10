/*
---

name: ActivityIndicatorStyle

description: Provide styles for ActivityIndicator instances.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	
provides:
	- ActivityIndicatorStyle

...
*/

Moobile.ActivityIndicatorStyle = {

	Default: {

		onAttach: function() {
			return this.addClass('style-default');
		},

		onDetach: function() {
			return this.removeClass('style-default');
		}

	},

	Box: {

		onAttach: function() {
			return this.addClass('style-box');
		},

		onDetach: function() {
			return this.removeClass('style-box');
		}
		
	}

};