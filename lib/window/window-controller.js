"use strict"

var ViewController = moobile.ViewController;

/**
 * @see    http://moobilejs.com/doc/latest/Window/WindowController
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
var WindowController = moobile.WindowController = new Class({

	Extends: ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_rootViewController: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	loadView: function() {

		var element = document.id('window');
		if (element === null) {
			element = document.createElement('div');
			element.inject(document.body);
		}

		this.view = new Moobile.Window(element);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Window/WindowController#setRootViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setRootViewController: function(rootViewController) {

		if (this._rootViewController) {
			this._rootViewController.destroy();
			this._rootViewController = null;
		}

		if (rootViewController) {
 			this.addChildViewController(rootViewController);
		}

		this._rootViewController = rootViewController;

		// this.view._setReady(true);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Window/WindowController#getRootViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getRootViewController: function() {
		return this._rootViewController;
	}

});
