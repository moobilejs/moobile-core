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
 * @name  WindowController
 * @class Provides a view controller that manages a window.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Options]
 *
 * @extends ViewController
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.WindowController = new Class( /** @lends WindowController.prototype */ {

	Extends: Moobile.ViewController,

	/**
	 * @var    {ViewController} The root view controller.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	rootViewController: null,

	loadView: function() {

		var element = document.id('window');
		if (element == null) {
			element = new Element('div');
			element.inject(document.body);
		}

		this.view = new Moobile.Window(element);
		this.view.setReady();
	},

	/**
	 * Sets the root view controller.
	 *
	 * This method will set the view controller at the root of the view
	 * controller hierarchy. There can be only one root view controller at
	 * time meaning setting a new root view controller when there is an
	 * existing one will destroy the existing one.
	 *
	 * @param {ViewController} rootViewController The root view controller.
	 *
	 * @return {WindowController} This window controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setRootViewController: function(rootViewController) {

		if (this.rootViewController) {
			this.rootViewController.removeFromParentViewController();
			this.rootViewController.destroy();
			this.rootViewController = null;
		}

		if (rootViewController) {
			this.rootViewController = rootViewController;
			this.addChildViewController(rootViewController);
		}

		return this;
	},

	/**
	 * Returns the root view controller.
	 *
	 * This method will return the view controller at the root of the view
	 * controller hierarchy. There can be only one root view controller at time
	 * meaning setting a new root view controller when there is an existing one
	 * will destroy the existing one.
	 *
	 * @return {ViewController} The root view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getRootViewController: function() {
		return this.rootViewController;
	},

	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		this.rootViewController = viewController;
		return this;
	}

});
