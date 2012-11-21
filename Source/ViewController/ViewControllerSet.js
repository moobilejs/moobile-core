/*
---

name: ViewControllerSet

description: Manages a view set.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- ViewControllerSet

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.ViewControllerSet = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_animating: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_tabBar: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_selectedViewController: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_enteringViewController: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	options: {
		viewTransition: null,
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	loadView: function() {
		this.view = new Moobile.ViewSet();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	viewDidLoad: function() {
		this.parent();
		this._tabBar = this.view.getTabBar();
		this._tabBar.addEvent('select', this.bound('_onTabSelect'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	destroy: function() {
		this._tabBar.removeEvent('select', this.bound('_onTabSelect'));
		this._tabBar = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#setViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setChildViewControllers: function(viewControllers) {

		this._selectedViewController = null;
		this._enteringViewController = null;
		this.removeAllChildViewControllers(true);

		for (var i = 0; i < viewControllers.length; i++) this.addChildViewController(viewControllers[i]);

		return this.setSelectedViewController(viewControllers[0]);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#setSelectedViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setSelectedViewController: function(viewController, viewTransition) {

		if (this._animating)
			return this;

		var index = this.getChildViewControllerIndex(viewController);

		this._tabBar.setSelectedTabIndex(index);

		if (this._selectedViewController === null) {
			this.willSelectViewController(viewController);
			this._selectedViewController = viewController;
			this._selectedViewController.showView();
			this._selectedViewController.viewWillEnter();
			this._selectedViewController.viewDidEnter();
			this.didSelectViewController(viewController);
			return this;
		}

		if (this._selectedViewController === viewController)
			return this;

		this._enteringViewController = viewController;

		var enteringViewIndex = this.getChildViewControllerIndex(this._enteringViewController);
		var selectedViewindex = this.getChildViewControllerIndex(this._selectedViewController);

		var method = enteringViewIndex > selectedViewindex
		           ? 'enter'
		           : 'leave';

		var viewToShow = this._enteringViewController.getView();
		var viewToHide = this._selectedViewController.getView();

		this._animating = true; // needs to be set before the transition happens

		viewTransition = viewTransition || new Moobile.ViewTransition.None();
		viewTransition.addEvent('start:once', this.bound('onSelectTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onSelectTransitionComplete'));
		viewTransition[method].call(
			viewTransition,
			viewToShow,
			viewToHide
		);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#setSelectedViewControllerIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setSelectedViewControllerIndex: function(index, viewTransition) {

		var viewController = this.getChildViewControllerAt(index);
		if (viewController) {
			this.setSelectedViewController(viewController, viewTransition)
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#getSelectedViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getSelectedViewController: function() {
		return this._selectedViewController;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#getTabBar
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTabBar: function() {
		return this._tabBar;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	onSelectTransitionStart: function(e) {
		this.willSelectViewController(this._enteringViewController);
		this._selectedViewController.viewWillLeave();
		this._enteringViewController.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	onSelectTransitionComplete: function(e) {

		this._selectedViewController.viewDidLeave();
		this._enteringViewController.viewDidEnter();
		this.didSelectViewController(this._enteringViewController);

		this._selectedViewController = this._enteringViewController;
		this._enteringViewController = null;
		this._animating = false;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didAddChildViewController: function(viewController) {

		this.parent(viewController);

		viewController.hideView();

		var tab = new Moobile.Tab;
		tab.setLabel(viewController.getTitle());
		tab.setImage(viewController.getImage());
		this._tabBar.addTab(tab);

		viewController.setViewControllerSet(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didRemoveChildViewController: function(viewController) {

		this.parent(viewController);

		viewController.setViewControllerSet(null);
		viewController.showView();

		var index = this.getChildViewControllerIndex(viewController);

		if (this._selectedViewController === viewController) {
			this._selectedViewController = null;
		}

		var tab = this._tabBar.getTabAt(index);
		if (tab) {
			tab.removeFromParentComponent();
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#willSelectViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willSelectViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#didSelectViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	didSelectViewController: function(viewController) {

	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_onTabSelect: function(tab) {

		var index = this._tabBar.getChildComponentIndex(tab);

		var viewController = this.getChildViewControllerAt(index);
		if (viewController !== this._selectedViewController) {
			this.setSelectedViewController(viewController, this.options.viewTransition);
		}
	}

});

Class.refactor(Moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_viewControllerSet: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#setViewControllerSet
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setViewControllerSet: function(viewControllerSet) {

		if (this._viewControllerSet === viewControllerSet)
			return this;

		this.parentViewControllerSetWillChange(viewControllerSet);
		this._viewControllerSet = viewControllerSet;
		this.parentViewControllerSetDidChange(viewControllerSet);

		if (this instanceof Moobile.ViewControllerSet)
			return this;

		var by = function(component) {
			return !(component instanceof Moobile.ViewControllerSet);
		};

		this.getChildViewControllers().filter(by).invoke('setViewControllerSet', viewControllerSet);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#getViewControllerSet
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getViewControllerSet: function() {
		return this._viewControllerSet;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#parentViewControllerSetWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	parentViewControllerSetWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewControllerSet#parentViewControllerSetDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	parentViewControllerSetDidChange: function(viewController) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerSet(this._viewControllerSet);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerSet(null);
	}

});
