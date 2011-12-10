/*
---

name: Window

description: Provides the root of a view hierarchy.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Window

...
*/

if (!window.$moobile) window.$moobile = {};

/**
 * @name  Window
 * @class Provides the root view of the entire view hierarchy.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Options]
 *
 * @extends View
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Window = new Class( /** @lends Window.prototype */ {

	Extends: Moobile.View,

	/**
	 * Return the orientation.
	 *
	 * This method will return a string that is either `portrait` or `landscape`
	 * representing the current orientation of the window.
	 *
	 * @return {String} The orientation.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getOrientation: function() {
		var o = Math.abs(window.orientation);
		switch (o) {
			case  0: return 'portrait';
			case 90: return 'landscape';
		}
	},

	position: function() {
		window.scrollTo(0, 1);
	},

	didLoad: function() {
		this.parent();
		this.element.set('class', 'window');
		window.addEvent('load', this.bound('onWindowLoad'));
		window.addEvent('orientationchange', this.bound('onWindowOrientationChange'));
	},

	willUnload: function() {
		this.parent();
		window.removeEvent('load', this.bound('onWindowLoad'));
		window.removeEvent('orientationchange', this.bound('onWindowOrientationChange'));
	},

	didAddChild: function(entity) {
		this.parent(entity);
		entity.setWindow(this);
		entity.setOwner(this);
	},

	onWindowLoad: function(e) {
		this.position.delay(250);
	},

	onWindowOrientationChange: function(e) {
		this.position();
		this.fireEvent('orientationchange', this.getOrientation());
	}
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view-content', Moobile.Window, function(element) {
	var instance = new Moobile.ViewContent(element, null, name);
	this.setContent(instance);
});
