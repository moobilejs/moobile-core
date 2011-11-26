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
 * Provides the root of a view hierarchy.
 *
 * @name Window
 * @class Window
 * @extends View
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Window = new Class( /** @lends Window.prototype */ {

	Extends: Moobile.View,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'window'
	},

	/**
	 * @see Entity#initialize
	 */
	initialize: function(element, options) {
		this.parent(element, options, 'window');
		return this;
	},

	/**
	 * Return the current orientation name: portrait or landscape.
	 * @return {String}
	 * @since 0.1
	 */
	getOrientation: function() {
		var o = Math.abs(window.orientation);
		switch (o) {
			case  0: return 'portrait';
			case 90: return 'landscape';
		}
	},

	/**
	 * Scroll the window at the top, hiding safari's address bar.
	 * @since 0.1
	 * @ignore
	 */
	position: function() {
		window.scrollTo(0, 1);
	},

	/**
	 * @see Entity#willLoad
	 */
	willLoad: function() {

		this.parent()

		if (this.element == null) {
			this.element = new Element('div');
			this.element.inject(document.body);
		}
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {

		window.addEvent('load', this.bound('onWindowLoad'));
		window.addEvent('orientationchange', this.bound('onWindowOrientationChange'));

		this.setReady();
	},

	/**
	 * @see Entity#willUnload
	 */
	willUnload: function() {
		window.removeEvent('load', this.bound('onWindowLoad'));
		window.removeEvent('orientationchange', this.bound('onWindowOrientationChange'));
	},

	/**
	 * @see Entity#didAddChild
	 */
	didAddChild: function(entity) {
		entity.setWindow(this);
	},

	/**
	 * Window load event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @ignore
	 */
	onWindowLoad: function(e) {
		this.position.delay(250);
	},

	/**
	 * Orientation change event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @ignore
	 */
	onWindowOrientationChange: function(e) {
		this.position();
		this.fireEvent('orientationchange', this.getOrientation());
	}
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('content', Moobile.Window, function(element, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.WindowContent, element, null, name);

	if (instance instanceof Moobile.WindowContent) {
		this.addChild(instance);
		this.content = instance; // must be assigned after addChild is called
	}

	return instance;
});
