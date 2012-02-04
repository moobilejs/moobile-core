/*
---

name: ViewControllerPanel

description: Manages a view panel.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewControllerCollection

provides:
	- ViewControllerPanel

...
*/

/**
 * @name  ViewControllerPanel
 * @class Provides an object used to manage a view panel.
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
Moobile.ViewControllerPanel = new Class( /** @lends ViewControllerPanel.prototype */ {

	Extends: Moobile.ViewController,

	/**
	 * The main view controller.
	 * @type   ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	mainViewController: null,

	/**
	 * The side view controller.
	 * @type   ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	sideViewController: null,

	loadView: function() {
		this.view = new Moobile.ViewPanel();
	},

	/**
	 * Sets the main view controller.
	 *
	 * This method will set the main view controller and add its view to the
	 * view's main panel. There can be only one main view controller at time
	 * meaning setting a new main view controller when there is an existing one
	 * will destroy the existing one.
	 *
	 * @param {ViewController} mainViewController The main view controller.
	 *
	 * @return {ViewControllerPanel} This view controller panel.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setMainViewController: function(mainViewController) {

		if (this.mainViewController) {
			this.mainViewController.removeFromParentViewController();
			this.mainViewController.destroy();
			this.mainViewController = null;
		}

		this.mainViewController = mainViewController;

		this.addChildViewController(this.mainViewController, 'top', this.view.getMainPanel());

		return this;
	},

	/**
	 * Returns the main view controller.
	 *
	 * @return {ViewController} The main view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getMainViewController: function() {
		return this.mainViewController;
	},

	/**
	 * Sets the side view controller.
	 *
	 * This method will set the side view controller and add its view to the
	 * view's side panel. There can be only one main view controller at time
	 * meaning setting a new side view controller when there is an existing one
	 * will destroy the existing one.
	 *
	 * @param {ViewController} sideViewController The side view controller.
	 *
	 * @return {ViewControllerPanel} This view controller panel.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setSideViewController: function(sideViewController) {

		if (this.sideViewController) {
			this.sideViewController.destroy();
			this.sideViewController = null;
		}

		this.sideViewController = sideViewController;

		this.addChildViewController(this.sideViewController, 'top', this.view.getSidePanel());

		return this;
	},

	/**
	 * Returns the side view controller.
	 *
	 * @return {ViewController} The side view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getSideViewController: function() {
		return this.sideViewController;
	},

	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerPanel(this);
	}

});
