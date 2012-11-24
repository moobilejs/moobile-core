/*
---

name: Bar

description: Provides a control that displays a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Bar

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/Bar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Bar = new Class({

	Extends: Moobile.Control,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.addClass('bar');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Component.defineRole('bar', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Bar, element, 'data-bar'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/**
 * Dark Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Component.defineStyle('dark', Moobile.Bar, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

/**
 * Light Style - iOS & Android
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Component.defineStyle('light', Moobile.Bar, {
	attach: function(element) { element.addClass('style-light'); },
	detach: function(element) { element.removeClass('style-light'); }
});
