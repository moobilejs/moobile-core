/*
---

name: BarButton

description: Provides a button used inside a Bar control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Button

provides:
	- BarButton

...
*/

Moobile.BarButton = new Class({

	Extends: Moobile.Button,

	options: {
		className: 'bar-button'
	}

});

/**
 * @role bar-button
 */
Moobile.Entity.defineRole('bar-button', null, function(element, options, name) {
	
	var instance = Class.instantiate(element.get('data-bar-button') || Moobile.BarButton, element, options, name);
	if (instance instanceof Moobile.BarButton) {
		this.addChild(instance);
	}	
	
	return instance;
});

/**
 * @style active
 */
Moobile.Entity.defineStyle('active', Moobile.BarButton, {
	attach: function(element) {
		element.addClass('style-active');
	},
	detach: function(element) {
		element.removeClass('style-active');
	}			
});

/**
 * @style warning
 */
Moobile.Entity.defineStyle('warning', Moobile.BarButton, {
	attach: function(element) {
		element.addClass('style-warning');
	},
	detach: function(element) {
		element.removeClass('style-warning');
	}			
});

/**
 * @style back
 */
Moobile.Entity.defineStyle('back', Moobile.BarButton, {
	attach: function(element) {
		element.addClass('style-back');
	},
	detach: function(element) {
		element.removeClass('style-back');
	}			
});

/**
 * @style forward
 */
Moobile.Entity.defineStyle('forward', Moobile.BarButton, {
	attach: function(element) {
		element.addClass('style-forward');
	},
	detach: function(element) {
		element.removeClass('style-forward');
	}			
});