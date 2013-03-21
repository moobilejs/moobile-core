"use strict"

var View = moobile.View;

/**
 * @see    http://moobilejs.com/doc/latest/Window/Window
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Window = moobile.Window = new Class({

	Extends: View,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	initialize: function(element, options, name) {
		instance = this;
		window.on('orientationchange', this.bound('__onWindowOrientationChange'));
		return this.parent(element, options, name);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		instance = null;
		window.off('orientationchange', this.bound('__onWindowOrientationChange'));
		this.parent();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.3.0
	 * @since  0.1.0
	 */
	willBuild: function() {
		this.parent();
		this.element.addClass('window');
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didAddChildComponent: function(component) {
		this.parent();
		component.__setParent(this)
		component.__setWindow(this)
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onWindowOrientationChange: function(e) {
		this.updateLayout()
	}

});

var instance = null;

Window.getCurrentInstance = function() {
	return instance;
};
