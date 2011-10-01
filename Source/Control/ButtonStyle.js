/*
---

name: ButtonStyle

description: Provide styles for Button instances.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- ButtonStyle

...
*/

if (!window.Moobile) window.Moobile = {};

Moobile.ButtonStyle = {

	Default: {

		onAttach: function() {
			return this.addClass('style-default');
		},

		onDetach: function() {
			return this.removeClass('style-default');
		}

	}

};
