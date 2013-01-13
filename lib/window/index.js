"use strict"

var View = require('../view');

/**
 * @see    http://moobilejs.com/doc/latest/Window/Window
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var Window = new Class({

	Extends: View,

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

var instance = null;

Window.getCurrentInstance = function() {
	return instance;
};

module.exports = Window