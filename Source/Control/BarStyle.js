/*
---

name: BarStyle

description: Provide constants for bar styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- BarStyle

...
*/

if (!window.Moobile) window.Moobile = {};

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