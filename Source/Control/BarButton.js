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
 * @see    http://moobile.net/api/0.1/Control/BarButton
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.BarButton = new Class({

	Extends: Moobile.Button,

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('bar-button');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('bar-button', null, function(element) {
	this.addChild(Moobile.Component.create(Moobile.BarButton, element, 'data-bar-button'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('active', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-active'); },
	detach: function(element) { element.removeClass('style-active'); }
});

Moobile.Component.defineStyle('warning', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-warning'); },
	detach: function(element) { element.removeClass('style-warning'); }
});

Moobile.Component.defineStyle('back', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-back'); },
	detach: function(element) { element.removeClass('style-back'); }
});

Moobile.Component.defineStyle('forward', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-forward'); },
	detach: function(element) { element.removeClass('style-forward'); }
});

Moobile.Component.defineStyle('dark', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

Moobile.Component.defineStyle('dark-back', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-dark-back'); },
	detach: function(element) { element.removeClass('style-dark-back'); }
});

Moobile.Component.defineStyle('dark-forward', Moobile.BarButton, {
	attach: function(element) { element.addClass('style-dark-forward'); },
	detach: function(element) { element.removeClass('style-dark-forward'); }
});

