/*
---

name: WindowController

description: Manages a window.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- WindowController

...
*/

/**
 * @see    http://moobile.net/api/0.1/Window/WindowController
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.WindowController = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_rootViewController: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	loadView: function() {

		var element = document.id('window');
		if (element === null) {
			element = new Element('div');
			element.inject(document.body);
		}

		this.view = new Moobile.Window(element);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Window/WindowController#setRootViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setRootViewController: function(_rootViewController) {

		if (this._rootViewController) {
			this._rootViewController.destroy();
			this._rootViewController = null;
		}

		if (_rootViewController) {
 			this.addChildViewController(_rootViewController);
		}

		this._rootViewController = _rootViewController;

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Window/WindowController#getRootViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getRootViewController: function() {
		return this._rootViewController;
	}

});
