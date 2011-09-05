/*
---

name: ActivityIndicatorStyle

description: Provide constants for activity indicator styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- ActivityIndicatorStyle

...
*/

if (!window.Moobile) window.Moobile = {};

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