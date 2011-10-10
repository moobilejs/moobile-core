/*
---

name: BarButtonStyle

description: Provide styles for BarButton instances.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- BarButtonStyle

...
*/

Moobile.BarButtonStyle = {

	Default: {

		onAttach: function() {
			return this.addClass('style-default');
		},

		onDetach: function() {
			return this.removeClass('style-default');
		}

	},

	Active: {

		onAttach: function() {
			return this.addClass('style-active');
		},

		onDetach: function() {
			return this.removeClass('style-active');
		}

	},

	Warning: {

		onAttach: function() {
			return this.addClass('style-warning');
		},

		onDetach: function() {
			return this.removeClass('style-warning');
		}

	},

	Back: {

		onAttach: function() {
			return this.addClass('style-back');
		},

		onDetach: function() {
			return this.removeClass('style-back');
		}

	},

	Forward: {

		onAttach: function() {
			return this.addClass('style-forward');
		},

		onDetach: function() {
			return this.removeClass('style-forward');
		}

	}

};