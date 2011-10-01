
/*
---

name: ViewTransition.None

description: Provide a non-animated view transition

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewTransition

provides:
	- ViewTransition.None

...
*/

Moobile.ViewTransition.None = new Class({

	Extends: Moobile.ViewTransition,

	enter: function(viewToShow, viewToHide, parentView, first) {
		this.parent(viewToShow, viewToHide, parentView, first);
		this.fireEvent('stop');
		this.fireEvent('complete');
		return this;
	},

	leave: function(viewToShow, viewToHide, parentView) {
		this.parent(viewToShow, viewToHide, parentView);
		this.fireEvent('stop');
		this.fireEvent('complete');
		return this;
	}

});
