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
	 * @private
	 */
	position: function() {
		window.scrollTo(0, 1);
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {
		this.parent();
		this.element.set('class', 'window');
		window.addEvent('load', this.bound('onWindowLoad'));
		window.addEvent('orientationchange', this.bound('onWindowOrientationChange'));
	},

	/**
	 * @see Entity#willUnload
	 */
	willUnload: function() {
		this.parent();
		window.removeEvent('load', this.bound('onWindowLoad'));
		window.removeEvent('orientationchange', this.bound('onWindowOrientationChange'));
	},

	/**
	 * @see Entity#didAddChild
	 */
	didAddChild: function(entity) {
		this.parent(entity);
		entity.setWindow(this);
		entity.setOwner(this);
	},

	/**
	 * Window load event handler.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onWindowLoad: function(e) {
		this.position.delay(250);
	},

	/**
	 * Orientation change event handler.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onWindowOrientationChange: function(e) {
		this.position();
		this.fireEvent('orientationchange', this.getOrientation());
	}
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view-content', Moobile.Window, function(element, name) {

	var instance = Class.instantiate(element.get('data-content') || Moobile.WindowContent, element, null, name);

	if (instance instanceof Moobile.WindowContent) {
		this.addChild(instance);
		this.content = instance; // must be assigned after addChild is called
	}

	return instance;
});
