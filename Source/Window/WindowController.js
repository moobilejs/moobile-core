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
 * @name  View
 * @class Manages a window.
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
	 * @var    {ViewController} The view controller at the root of the hierarchy.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	rootViewController: null,

	/**
	 * Set the view controller at the root of the hierarchy. The current root
	 * view controller will be destroyed before the new one is assigned.
	 *
	 * @param {ViewController} rootViewController The view controller.
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
	 * Return the view controller at the root of the hierarchy.
	 *
	 * @return {ViewController} The view controller at the root of the hierarchy.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getRootViewController: function() {
		return this.rootViewController;
	},

	loadView: function() {

		var element = document.id('window');
		if (element == null) {
			element = new Element('div');
			element.inject(document.body);
		}

		this.view = new Moobile.Window(element);
		this.view.setReady();
	},

	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		this.rootViewController = viewController;
		return this;
	}

});
