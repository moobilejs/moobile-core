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
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {
		this.parent();
		this.element.set('class', 'window');
		window.addEvent('load', this.bound('_onWindowLoad'));
		window.addEvent('rotate', this.bound('_onWindowRotate'));
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didBuild: function() {
		this.parent();
		this.content.addClass('window-content');
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		window.removeEvent('load', this.bound('_onWindowLoad'));
		window.removeEvent('rotate', this.bound('_onWindowRotate'));
		this.parent();
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChild: function(component) {
		this.parent(component);
		component.setWindow(this);
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChild: function() {
		this.parent(component);
		component.setWindow(null);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onWindowLoad: function(e) {
		(function() { window.scrollTo(0, 1) }).delay(250);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onWindowRotate: function(e) {
		(function() { window.scrollTo(0, 1) }).delay(250);
	}

});
