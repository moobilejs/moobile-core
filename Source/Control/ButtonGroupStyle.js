/*
---

name: ButtonGroupStyle

description: Provide constants for button group styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- ButtonGroupStyle

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.ButtonGroupStyle = {

	Horizontal: {

		onAttach: function() {
			return this.addClass('style-horizontal');
		},

		onDetach: function() {
			return this.removeClass('style-horizontal');
		}

	},

	Vertical: {

		onAttach: function() {
			return this.addClass('style-vertical');
		},

		onDetach: function() {
			return this.removeClass('style-vertical');
		}

	}

};
