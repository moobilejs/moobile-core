/*
---

name: Animation.FromClass

description:

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Animation

provides:
	- Animation.FromClass

...
*/

Moobile.Animation.FromClass = new Class({

	Extends: Moobile.Animation,

	className: null,

	initialize: function(element, className) {
		this.className = className;
		return this.parent(element);
	},

	enableStyles: function() {
		this.element.addClass(this.className);
		return this.parent();
	},

	disableStyle: function() {
		this.element.removeClass(this.className);
		return this.parent();
	}

})