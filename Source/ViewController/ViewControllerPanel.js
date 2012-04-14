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
 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.ViewControllerPanel = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_mainViewController: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_sideViewController: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	loadView: function() {
		this.view = new Moobile.ViewPanel();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#setMainViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setMainViewController: function(mainViewController) {

		if (this._mainViewController) {
			this._mainViewController.destroy();
			this._mainViewController = null;
		}

		var view = mainViewController.getView();
		if (view) {
			this.view.addChildComponentInside(view, this.view.getMainPanel());
		}

		viewController.setViewControllerPanel(this);

		this.addChildViewController(mainViewController);

		this._mainViewController = mainViewController;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#getMainViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMainViewController: function() {
		return this._mainViewController;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#setSideViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setSideViewController: function(sideViewController) {

		if (this._sideViewController) {
			this._sideViewController.destroy();
			this._sideViewController = null;
		}

		var view = sideViewController.getView();
		if (view) {
			this.view.addChildComponentInside(view, this.view.getSidePanel())
		}

		viewController.setViewControllerPanel(this);

		this.addChildViewController(sideViewController);

		this._sideViewController = _sideViewController;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#getSideViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getSideViewController: function() {
		return this._sideViewController;
	}

});

Class.refactor(Moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_viewControllerPanel: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#setViewControllerPanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setViewControllerPanel: function(viewControllerPanel) {
		this._viewControllerPanel = viewControllerPanel;
		return this
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/ViewController/ViewControllerPanel#getViewControllerPanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getViewControllerPanel: function(viewControllerPanel) {
		return this._viewControllerPanel;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		if (viewController.getViewControllerPanel() === null) {
			viewController.setViewControllerPanel(this._viewControllerPanel);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerPanel(null);
	}

});
