/*
---

name: UI.BarButtonStyle

description: Provide constants for bar button styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- UI.BarButtonStyle

...
*/

if (!window.Moobile) window.Moobile = {};
if (!window.Moobile.UI) window.Moobile.UI = {};

Moobile.UI.BarButtonStyle = {

	Default: {
		className: 'style-default',
		attach: function() {},
		detach: function() {}
	},

	Active: {
		className: 'style-active',
		attach: function() {},
		detach: function() {}
	},

	Warning: {
		className: 'style-warning',
		attach: function() {},
		detach: function() {}
	},

	Back: {
		className: 'style-back',
		attach: function() {},
		detach: function() {}
	},

	Forward: {
		className: 'style-forward',
		attach: function() {},
		detach: function() {}
	}

};