/*
---

name: UI.ListStyle

description: Provide constants for list styles.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:

provides:
	- UI.ListStyle

...
*/

if (!window.Moobile) window.Moobile = {};
if (!window.Moobile.UI) window.Moobile.UI = {};

Moobile.UI.ListStyle = {

	Default: {
		className: 'style-default',
		attach: function() {},
		detach: function() {}
	},
	
	Grouped: {
		className: 'style-grouped',
		attach: function() {},
		detach: function() {}	
	}
	
};
