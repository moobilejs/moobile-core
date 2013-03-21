"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
var ViewControllerSet = moobile.ViewControllerSet = new Class({

	Extends: moobile.ViewController,

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
		this.view = new moobile.ViewSet();
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	viewDidLoad: function() {
		this.parent();
		this._tabBar = this.view.getTabBar();
		this._tabBar.on('select', this.bound('_onTabSelect'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	destroy: function() {
		this._tabBar.off('select', this.bound('_onTabSelect'));
		this._tabBar = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#setViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setChildViewControllers: function(viewControllers) {

		this._selectedmoobile.ViewController = null;
		this._enteringmoobile.ViewController = null;
		this.removeAllChildViewControllers(true);

		for (var i = 0; i < viewControllers.length; i++) this.addChildViewController(viewControllers[i]);

		return this.showmoobile.ViewController(viewControllers[0]);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#showmoobile.ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	showViewController: function(viewController, viewTransition) {

		if (this._animating)
			return this;

		var index = this.getChildViewControllerIndex(viewController);
		if (index === -1)
			return this;

		this._tabBar.setSelectedTabIndex(index);

		if (this._selectedmoobile.ViewController === null) {
			this.willSelectmoobile.ViewController(viewController);
			this._selectedmoobile.ViewController = viewController;
			this._selectedmoobile.ViewController.showView();
			this._selectedmoobile.ViewController.viewWillEnter();
			this._selectedmoobile.ViewController.viewDidEnter();
			this.didSelectmoobile.ViewController(viewController);
			return this;
		}

		if (this._selectedmoobile.ViewController === viewController)
			return this;

		this._enteringmoobile.ViewController = viewController;

		var enteringViewIndex = this.getChildViewControllerIndex(this._enteringmoobile.ViewController);
		var selectedViewindex = this.getChildViewControllerIndex(this._selectedmoobile.ViewController);

		var method = enteringViewIndex > selectedViewindex
		           ? 'enter'
		           : 'leave';

		var viewToShow = this._enteringmoobile.ViewController.getView();
		var viewToHide = this._selectedmoobile.ViewController.getView();

		this._animating = true; // needs to be set before the transition happens

		viewTransition = viewTransition || new ViewTransition.None();
		viewTransition.on('start:once', this.bound('onSelectTransitionStart'));
		viewTransition.on('complete:once', this.bound('onSelectTransitionComplete'));
		viewTransition[method].call(
			viewTransition,
			viewToShow,
			viewToHide
		);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#showmoobile.ViewControllerIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	showmoobile.ViewControllerAt: function(index, viewTransition) {

		var viewController = this.getChildViewControllerAt(index);
		if (viewController) {
			this.showmoobile.ViewController(viewController, viewTransition)
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#getSelectedmoobile.ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getSelectedViewController: function() {
		return this._selectedmoobile.ViewController;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#getTabBar
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
		this.willSelectmoobile.ViewController(this._enteringmoobile.ViewController);
		this._selectedmoobile.ViewController.viewWillLeave();
		this._enteringmoobile.ViewController.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	onSelectTransitionComplete: function(e) {

		this._selectedmoobile.ViewController.viewDidLeave();
		this._enteringmoobile.ViewController.viewDidEnter();
		this.didSelectmoobile.ViewController(this._enteringmoobile.ViewController);

		this._selectedmoobile.ViewController = this._enteringmoobile.ViewController;
		this._enteringmoobile.ViewController = null;
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

		var tab = new Tab;
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

		if (this._selectedmoobile.ViewController === viewController) {
			this._selectedmoobile.ViewController = null;
		}

		if (this._tabBar) {
			// the tab bar might be destroyed at this point when the view is
			// going to be destroyed
			var tab = this._tabBar.getTabAt(index);
			if (tab) {
				tab.removeFromParentComponent();
			}
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#willSelectmoobile.ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willSelectViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#didSelectmoobile.ViewController
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
		if (viewController !== this._selectedmoobile.ViewController) {
			this.showmoobile.ViewController(viewController, this.options.viewTransition);
		}
	}

});

Class.refactor(moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_viewControllerSet: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#setViewControllerSet
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setViewControllerSet: function(viewControllerSet) {

		if (this._viewControllerSet === viewControllerSet)
			return this;

		this.parentViewControllerSetWillChange(viewControllerSet);
		this._viewControllerSet = viewControllerSet;
		this.parentViewControllerSetDidChange(viewControllerSet);

		if (this instanceof moobile.ViewControllerSet)
			return this;

		var by = function(component) {
			return !(component instanceof moobile.ViewControllerSet);
		};

		this.getChildViewControllers().filter(by).invoke('setViewControllerSet', viewControllerSet);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#getViewControllerSet
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getViewControllerSet: function() {
		return this._viewControllerSet;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#parentViewControllerSetWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	parentViewControllerSetWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/moobile.ViewController/moobile.ViewControllerSet#parentViewControllerSetDidChange
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
