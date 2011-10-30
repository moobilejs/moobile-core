/*
---

name: Bar

description: Provide the base class for a Bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- BarRoles	
	- BarStyle

provides:
	- Bar

...
*/

Moobile.Bar = new Class({

	Extends: Moobile.Control,

	options: {
		className: 'bar'
	}

});

/**
 * @style translucent
 */
Moobile.Entity.defineStyle('translucent', Moobile.Bar, {
	attach: function(element) {
		element.addClass('style-translucent');
	},			
	detach: function(element) {
		element.removeClass('style-translucent');
	}			
});

/**
 * @style black-opaque
 */
Moobile.Entity.defineStyle('black', Moobile.Bar, {
	attach: function(element) {
		element.addClass('style-black');
	},			
	detach: function(element) {
		element.removeClass('style-black');
	}			
});

/**
 * @style black-translucent
 */
Moobile.Entity.defineStyle('black-translucent', Moobile.Bar, {
	attach: function(element) {
		element
			.addClass('style-black')
			.addClass('style-black-translucent');
	},			
	detach: function(element) {
		element
			.removeClass('style-black')
			.removeClass('style-black-translucent');
	}
});