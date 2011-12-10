/*
---

name: BarButton

description: Provides a button control used inside bar controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Button

provides:
	- BarButton

...
*/

/**
 * @name  BarButton
 * @class Provides a bar button control.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * Note: The `button` role automatically creates a bar button if placed
 * inside a bar, bar item, bar-button-group.
 *
 * @extends Button
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.BarButton = new Class( /** @lends BarButton.prototype */ {

	Extends: Moobile.Button,

	didLoad: function() {
		this.parent();
		this.element.addClass('bar-button');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar-button', null, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-bar-button', Moobile.BarButton);
	this.addChild(instance);
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('active', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-active'); },
	detach: function(element) { element.removeClass('style-active'); }
});

Moobile.Entity.defineStyle('warning', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-warning'); },
	detach: function(element) { element.removeClass('style-warning'); }
});

Moobile.Entity.defineStyle('back', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-back'); },
	detach: function(element) { element.removeClass('style-back'); }
});

Moobile.Entity.defineStyle('forward', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-forward'); },
	detach: function(element) { element.removeClass('style-forward'); }
});

Moobile.Entity.defineStyle('dark', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

Moobile.Entity.defineStyle('dark-back', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-dark-back'); },
	detach: function(element) { element.removeClass('style-dark-back'); }
});

Moobile.Entity.defineStyle('dark-forward', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-dark-forward'); },
	detach: function(element) { element.removeClass('style-dark-forward'); }
});

