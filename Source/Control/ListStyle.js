/*
---

name: ListStyle

description: Provide constants for list styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- ListStyle

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.ListStyle = {

	Default: {

		onAttach: function() {
			return this.addClass('style-default');
		},

		onDetach: function() {
			return this.removeClass('style-default');
		}

	},

	Grouped: {

		onAttach: function() {
			return this.addClass('style-grouped');
		},

		onDetach: function() {
			return this.removeClass('style-grouped');
		}
		
	}

};
