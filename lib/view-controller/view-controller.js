"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.3.0
 * @since  0.1.0
 */
var ViewController = moobile.ViewController = new Class({

	Extends: moobile.Emitter,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__id: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__name: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__title: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__image: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__viewReady: false,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__viewTransition: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__parent: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__children: [],

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#modal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__modal: false,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#modalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__modalViewController: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#view
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	view: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(options, name) {

		this.__name = name;

		this.setOptions(options);

		this.loadView();
		if (this.view) {
			this.view.addEvent('ready', this.bound('__onViewDidBecomeReady'));
			this.view.addEvent('layout', this.bound('__onViewDidUpdateLayout'));
			this.viewDidLoad();
		}

		window.addEvent('orientationchange', this.bound('__onWindowOrientationChange'));

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#loadView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	loadView: function() {
		if (this.view === null) {
			this.view = new moobile.View();
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#showView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	showView: function() {
		this.view.show();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#hideView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.1
	 */
	hideView: function() {
		this.view.hide();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#addChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildViewController: function(viewController) {
		return this._addChildViewController(viewController);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#addChildViewControllerAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildViewControllerAfter: function(viewController, after) {

		var index = this.getChildViewControllerIndex(after);
		if (index === -1)
			return this;

		return this._addChildViewController(viewController, after, 'after');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#addChildViewControllerBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildViewControllerBefore: function(viewController, before) {

		var index = this.getChildViewControllerIndex(before);
		if (index === -1)
			return this;

		return this._addChildViewController(viewController, before, 'before');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#addChildViewControllerAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildViewControllerAt: function(viewController, index) {

		if (index > this.__children.length) {
			index = this.__children.length;
		} else if (index < 0) {
			index = 0;
		}

		var before = this.getChildViewControllerAt(index);
		if (before) {
			return this.addChildViewControllerBefore(viewController, before);
		}

		return this.addChildViewController(viewController);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_addChildViewController: function(viewController, context, where) {

		viewController.removeFromParentViewController();

		this.willAddChildViewController(viewController);

		if (context) {

			this.__children.splice(this.getChildViewControllerIndex(context), 0, viewController);

			switch (where) {
				case 'before':
					this.view.addChildComponentBefore(viewController.view, context.view);
					break;
				case 'after':
					this.view.addChildComponentAfter(viewController.view, context.view);
					break;
			}

		} else {
			this.__children.push(viewController);
			this.view.addChildComponent(viewController.view);
		}

		viewController.setParentViewController(this);

		this.didAddChildViewController(viewController);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewController: function(name) {
		return this.__children.find(function(viewController) { return viewController.getName() === name; });
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewControllerAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewControllerAt: function(index) {
		return this.__children[index] || null;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewControllerIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewControllerIndex: function(viewController) {
		return this.__children.indexOf(viewController);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getChildViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewControllers: function() {
		return this.__children;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#hasChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildViewController: function(viewController) {
		return this.__children.contains(viewController);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#removeChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeChildViewController: function(viewController, destroy) {

		if (!this.hasChildViewController(viewController))
			return this;

		this.willRemoveChildViewController(viewController);
		this.__children.erase(viewController);
		viewController.setParentViewController(null);

		var view = viewController.getView();
		if (view) {
			view.removeFromParentComponent();
		}

		this.didRemoveChildViewController(viewController);

		if (destroy) {
			viewController.destroy();
		}

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#removeFromParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	removeFromParentViewController: function(destroy) {
		if (this.__parent) this.__parent.removeChildViewController(this, destroy);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#removeAllChildViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllChildViewControllers: function(destroy) {

		this.__children.filter(function() {
			return true;
		}).invoke('removeFromParentViewController', destroy);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#presentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	presentModalViewController: function(viewController, viewTransition) {

		if (this.__modalViewController)
			return this;

		var parentView = this.view.getWindow();
		if (parentView === null)
			throw new Error('The view to present is not ready');

		this.willPresentModalViewController(viewController);

		this.__modalViewController = viewController;
		this.__modalViewController.setParentViewController(this);
		this.__modalViewController.setModal(true);

		var viewToShow = this.__modalViewController.getView();
		var viewToHide = parentView.getChildComponentsByType(View).getLastItemAtOffset(0);

		parentView.addChildComponent(viewToShow);

		viewTransition = viewTransition || new ViewTransition.Cover;
		viewTransition.addEvent('start:once', this.bound('__onPresentTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('__onPresentTransitionCompleted'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			parentView
		);

		viewController.setViewTransition(viewTransition);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#dismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	dismissModalViewController: function() {

		if (this.__modalViewController === null)
			return this;

		var parentView = this.view.getWindow();
		if (parentView === null)
			throw new Error('The view to dismiss is not ready');

		this.willDismissModalViewController()

		var viewToShow = parentView.getChildComponentsByType(View).getLastItemAtOffset(1);
		var viewToHide = this.__modalViewController.getView();

		var viewTransition = this.__modalViewController.getViewTransition();
		viewTransition.addEvent('start:once', this.bound('__onDismissTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('__onDismissTransitionCompleted'));
		viewTransition.leave(
			viewToShow,
			viewToHide,
			parentView
		);

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getName: function() {
		return this.__name;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getId
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getId: function() {

		var name = this.getName();
		if (name) {
			return name;
		}

		if (this.__id === null) {
			this.__id = String.uniqueID();
		}

		return this.__id;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		if (this.__title === title)
			return this;

		title = moobile.Text.from(title);

		if (this.__title &&
			this.__title.hasParentComponent()) {
			this.__title.replaceWithComponent(title, true);
		}

		this.__title = title;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this.__title;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setImage: function(image) {

		if (this.__image === image)
			return this;

		image = moobile.Image.from(image);

		if (this.__image &&
			this.__image.hasParentComponent()) {
			this.__image.replaceWithComponent(image, true);
		}

		this.__image = image;

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this.__image;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setModal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setModal: function(modal) {
		this.__modal = modal;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#isModal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isModal: function() {
		return this.__modal;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#isViewReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isViewReady: function() {
		return this.__viewReady;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getView: function() {
		return this.view;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setViewTransition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setViewTransition: function(viewTransition) {
		this.__viewTransition = viewTransition;
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getViewTransition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewTransition: function() {
		return this.__viewTransition;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#setParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setParentViewController: function(viewController) {
		this.parentViewControllerWillChange(viewController);
		this.__parent = viewController;
		this.parentViewControllerDidChange(viewController);
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#getParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParentViewController: function() {
		return this.__parent;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#willAddChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#didAddChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#willRemoveChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willRemoveChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#didRemoveChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#parentViewControllerWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#parentViewControllerDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerDidChange: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#willPresentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willPresentModalViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#didPresentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didPresentModalViewController: function(viewController) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#willDismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willDismissModalViewController: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#didDismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didDismissModalViewController: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidLoad
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewDidLoad: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewDidBecomeReady: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidUpdateLayout
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	viewDidUpdateLayout: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewWillEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewWillEnter: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewDidEnter: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewWillLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewWillLeave: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewDidLeave: function() {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#viewDidRotate
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	viewDidRotate: function(orientation) {

	},

	/**
	 * @see    http://moobilejs.com/doc/latest/ViewController/ViewController#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		window.removeEvent('orientationchange', this.bound('__onWindowOrientationChange'));

		this.removeAllChildViewControllers(true);

		this.removeFromParentViewController();

		if (this.__modalViewController) {
			this.__modalViewController.destroy();
			this.__modalViewController = null;
		}

		this.view.removeEvent('ready', this.bound('__onViewDidBecomeReady'));
		this.view.removeEvent('layout', this.bound('__onViewDidUpdateLayout'));
		this.view.destroy();
		this.view = null;

		if (this.__title) {
			this.__title.destroy();
			this.__title = null;
		}

		if (this.__image) {
			this.__image.destroy();
			this.__image = null;
		}

		this.__parent = null;
		this.__children = null
		this.__viewTransition = null;
	},

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onPresentTransitionStart: function() {
		this.__modalViewController.viewWillEnter();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onPresentTransitionCompleted: function() {
		this.__modalViewController.viewDidEnter();
		this.didPresentModalViewController()
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onDismissTransitionStart: function() {
		this.__modalViewController.viewWillLeave();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	__onDismissTransitionCompleted: function() {
		this.__modalViewController.viewDidLeave();
		this.__modalViewController.setParentViewController(this);
		this.__modalViewController.setModal(false);
		this.__modalViewController.destroy();
		this.__modalViewController = null;
		this.didDismissModalViewController();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onViewDidBecomeReady: function() {
		this.viewDidBecomeReady();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	__onViewDidUpdateLayout: function() {
		this.viewDidUpdateLayout();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	__onWindowOrientationChange: function(e) {

		var name = Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';

		// <0.1-compat>
		if (this.didRotate) {
			this.didRotate(name);
			console.log('[DEPRECATION NOTICE] The method "didRotate" will be removed in 0.4, use the method "viewDidRotate" instead');
		}
		// </0.1-compat>

		this.viewDidRotate(name);
	}

});
