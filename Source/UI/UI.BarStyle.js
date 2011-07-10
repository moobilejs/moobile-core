/*
---

name: UI.BarStyle

description: Provide constants for bar styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- UI.BarStyle

...
*/

if (!window.Moobile) window.Moobile = {};
if (!window.Moobile.UI) window.Moobile.UI = {};

Moobile.UI.BarStyle = {

	DefaultOpaque: {
		className: 'style-blue-opaque',
		attach: function() {},
		detach: function() {}
	},

	DefaultTranslucent: {
		className: 'style-blue-translucent',
		attach: function() {},
		detach: function() {}
	},

	BlackOpaque: {
		className: 'style-black-opaque',
		attach: function() {},
		detach: function() {}
	},

	BlackTranslucent: {
		className: 'style-black-translucent',
		attach: function() {},
		detach: function() {}
	}

};