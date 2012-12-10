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

(function() {

var instance = null;

/**
 * @see    http://moobilejs.com/doc/latest/Window/Window
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
Moobile.Window = new Class({

	Extends: Moobile.View,

	_orientationChanged: false,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(element, options, name) {
		instance = this;
		return this.parent(element, options, name);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.element.set('class', 'window');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		this.contentElement.addClass('window-content');
		this.contentWrapperElement.addClass('window-content-wrapper');

		this._setParent(null);
		this._setWindow(this);

		window.addEvent('orientationchange', this.bound('_onWindowOrientationChange'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		window.removeEvent('orientationchange', this.bound('_onWindowOrientationChange'));
		this.parent();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onWindowOrientationChange: function(e) {
		this._orientationChanged = true;
		this._setUpdateLayout(true);
	}

});

Moobile.Window.getCurrentInstance = function() {
	return instance;
};

})()
