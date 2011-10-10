/*
---

name: ButtonGroupStyle

description: Provide styles for ButtonGroup instances.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ButtonGroupStyle

...
*/

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
