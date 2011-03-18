/*
---

name: View.Navigation

description: Provides the view that represents the navigation stack.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- View
	- View.Stack

provides:
	- View.Navigation

...
*/

Moobile.View.Navigation = new Class({

	Extends: Moobile.View.Stack,

	options: {
		className: 'navigation-view',
		scroll: false,
		scrollRefresh: -1
	}

});