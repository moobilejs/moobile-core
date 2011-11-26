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
 * Manages a view panel.
 *
 * @name ViewControllerPanel
 * @class ViewControllerPanel
 * @extends ViewController
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewControllerPanel = new Class( /** @lends ViewControllerPanel.prototype */ {

	Extends: Moobile.ViewController,

	/**
	 * The main view controller.
	 * @type {ViewController}
	 */
	mainViewController: null,

	/**
	 * The side view controller.
	 * @type {ViewController}
	 */
	sideViewController: null,

	/**
	 * Set the main view controller.
	 * @param {ViewController} mainViewController The main view controller.
	 * @return {ViewControllerPanel}
	 * @since 0.1
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
	 * Return the main view controller.
	 * @return {ViewController}
	 * @since 0.1
	 */
	getMainViewController: function() {
		return this.mainViewController;
	},

	/**
	 * Set the side view controller.
	 * @param {ViewController} mainViewController The side view controller.
	 * @return {ViewControllerPanel}
	 * @since 0.1
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
	 * Return the side view controller.
	 * @return {ViewController}
	 * @since 0.1
	 */
	getSideViewController: function() {
		return this.sideViewController;
	},

	/**
	 * @see ViewController#loadView
	 */
	loadView: function() {
		this.view = new Moobile.ViewPanel();
	},

	/**
	 * @see ViewControlelr#didAddChildViewController
	 */
	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerPanel(this);
	}

});
