/*
---

name: BarStyle

description: Provide styles for Bar instances.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- BarStyle

...
*/

Moobile.BarStyle = {

	DefaultOpaque: {

		onAttach: function() {
			return this.addClass('style-default-opaque');
		},

		onDetach: function() {
			return this.removeClass('style-default-opaque');
		}

	},

	DefaultTranslucent: {

		onAttach: function() {
			return this.addClass('style-default-translucent');
		},

		onDetach: function() {
			return this.removeClass('style-default-translucent');
		}

	},

	BlackOpaque: {

		onAttach: function() {
			return this.addClass('style-black-opaque');
		},

		onDetach: function() {
			return this.removeClass('style-black-opaque');
		}

	},

	BlackTranslucent: {

		onAttach: function() {
			return this.addClass('style-black-translucent');
		},

		onDetach: function() {
			return this.removeClass('style-black-translucent');
		}

	}

};