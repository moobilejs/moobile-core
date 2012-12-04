/*
---

name: ViewControllerCarousel

description: Manages a view set.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ViewController

provides:
	- ViewControllerCarousel

...
*/

Moobile.ViewControllerCarousel = new Class({

	Extends: Moobile.ViewController,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3
	 */
	_animating: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3
	 */
	_currentViewController: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3
	 */
	_loadingViewController: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3
	 */
	loadView: function() {
		this.view = new Moobile.ViewCarousel();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewControllerCarousel/presentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	presentViewController: function(viewController, viewTransition, viewTransitionDirection) {

		if (this._animating)
			return this;

		if (viewTransitionDirection !== 'enter' ||
			viewTransitionDirection !== 'leave') {
			viewTransitionDirection = 'enter';
		}

		if (this._currentViewController === null) {
			this.addChildViewController(viewController);
			this.willPresentViewController(viewController);
			this._currentViewController = viewController;
			this._currentViewController.showView();
			this._currentViewController.viewWillEnter();
			this._currentViewController.viewDidEnter();
			this.didPresentViewController(viewController);
			return this;
		}

		this._loadingViewController = viewController;

		switch (viewTransitionDirection) {
			case 'enter':
				this.addChildViewControllerAfter(viewController, this._currentViewController);
				break;
			case 'leave':
				this.addChildViewControllerBefore(viewController, this._currentViewController);
				break;
			default:
				throw new Error('Invalid direction');
				break;
		}

		var viewToShow = this._loadingViewController.getView();
		var viewToHide = this._currentViewController.getView();

		this._animating = true; // needs to be set before the transition happens

		viewTransition = viewTransition || new Moobile.ViewTransition.None();
		viewTransition.addEvent('start:once', this.bound('_onSelectTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('_onSelectTransitionComplete'));
		viewTransition[viewTransitionDirection].call(
			viewTransition,
			viewToShow,
			viewToHide,
			this.view
		);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewControllerCarousel/getCurrentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	getCurrentViewController: function() {
		return this._currentViewController;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	_onSelectTransitionStart: function(e) {
		this.willPresentViewController(this._loadingViewController);
		this._currentViewController.viewWillLeave();
		this._loadingViewController.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	_onSelectTransitionComplete: function(e) {

		this._currentViewController.viewDidLeave();
		this._loadingViewController.viewDidEnter();
		this.didPresentViewController(this._loadingViewController);

		this._currentViewController.destroy();
		this._currentViewController = null;

		this._currentViewController = this._loadingViewController;
		this._loadingViewController = null;
		this._animating = false;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	didAddChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerSet(this);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	didRemoveChildViewController: function(viewController) {
		this.parent(viewController);
		viewController.setViewControllerSet(null);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewControllerCarousel/willPresentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	willPresentViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewControllerCarousel/didPresentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	didPresentViewController: function(viewController) {

	}

});

Class.refactor(Moobile.ViewController, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	_viewControllerCarousel: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/setViewControllerCarousel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	setViewControllerCarousel: function(viewControllerCarousel) {

		if (this._viewControllerCarousel === viewControllerCarousel)
			return this;

		this.viewControllerCarouselWillChange(viewControllerCarousel);
		this._viewControllerCarousel = viewControllerCarousel;
		this.viewControllerCarouselDidChange(viewControllerCarousel);

		if (this instanceof Moobile.ViewControllerCarousel)
			return this;

		var by = function(component) {
			return !(component instanceof Moobile.ViewControllerCarousel);
		};

		this.getChildViewControllers().filter(by).invoke('setViewControllerCarousel', viewControllerCarousel);

		return this;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	getViewControllerCarousel: function() {
		return this._viewControllerCarousel;
	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	viewControllerCarouselWillChange: function(viewController) {

	},

	/**
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	viewControllerCarouselDidChange: function(viewController) {

	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	willAddChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerCarousel(this._viewControllerCarousel);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  1.0
	 */
	willRemoveChildViewController: function(viewController) {
		this.previous(viewController);
		viewController.setViewControllerCarousel(null);
	}

});
