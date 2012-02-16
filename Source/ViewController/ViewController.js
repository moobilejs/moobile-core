/*
---

name: ViewController

description: Manages a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventDispatcher

provides:
	- ViewController

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * @name  ViewController
 * @class Provides a controller used to manage a view.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Options]
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewController = new Class( /** @lends ViewController.prototype */ {

	Extends: Moobile.EventDispatcher,

	/**
	 * The name.
	 * @type   String
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	name: null,

	/**
	 * The title.
	 * @type   Text
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	title: null,

	/**
	 * The image.
	 * @type   Image
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	image: null,

	/**
	 * Whether this view controller is modal.
	 * @type   Boolean
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	modal: false,

	/**
	 * The managed view.
	 * @type   View
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	view: null,

	/**
	 * Whether the managed view is ready.
	 * @type   Boolean
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewReady: false,

	/**
	 * The view transition.
	 * @type   ViewTransition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewTransition: null,

	/**
	 * The window controller
	 * @type   WindowController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	windowController: null,

	/**
	 * The view controller stack.
	 * @type   ViewControllerStack
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewControllerStack: null,

	/**
	 * The view controller panel.
	 * @type   ViewControllerPanel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewControllerPanel: null,

	/**
	 * The view controller tabs.
	 * @type   ViewControllerTabs
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewControllerTabs: null,

	/**
	 * The parent view controller.
	 * @type   ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewController: null,

	/**
	 * The modal view controller being presented.
	 * @type   ViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	modalViewController: null,

	/**
	 * The child view controllers.
	 * @type   Array
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	childViewControllers: [],

	/**
	 * Initialize this view controller.
	 *
	 * If you override this method, make sure you call the parent method at
	 * the beginning of your implementation.
	 *
	 * @param {Object} options The options.
	 * @param {String} name    The name.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	initialize: function(options, name) {

		this.name = name;

		this.setOptions(options);

		this.loadView();
		if (this.view) {
			this.view.addEvent('ready', this.bound('onViewReady'));
			this.viewDidLoad();
		}

		window.addEvent('rotate', this.bound('onWindowRotate'));

		return this;
	},

	/**
	 * Loads the view.
	 *
	 * This method has to be overridden and needs to create a view instance in
	 * the `view` property of this class. Do not call the parent method unless
	 * you are required to.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	loadView: function() {
		if (this.view == null) {
			this.view = new Moobile.View();
		}
	},

	/**
	 * Adds a child view controller.
	 *
	 * This method adds the child view controller's view at the bottom of its
	 * view. You may specify the location of the child view controller's view
	 * using the `where` parameter combined with the optional `context`
	 * parameter.
	 *
	 * @param {ViewController} viewController The child view controller.
	 *
	 * @return {Boolean} Whether the child view controller was successfully
	 *                   added.
	 *
	 * @see View#addChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildViewController: function(viewController) {

		if (this.childViewControllers.contains(viewController))
			return false;

		this.willAddChildViewController(viewController);

		viewController.parentViewControllerWillChange(this);

		if (!viewController.isModal()) {
			if (!viewController.getViewControllerStack()) viewController.setViewControllerStack(this.viewControllerStack);
			if (!viewController.getViewControllerPanel()) viewController.setViewControllerPanel(this.viewControllerPanel);
			if (!viewController.getViewControllerTabs())  viewController.setViewControllerTabs(this.viewControllerTabs);
		}

		viewController.setWindowController(this.windowController);
		viewController.setParentViewController(this);
		viewController.parentViewControllerDidChange(this);

		this.childViewControllers.push(viewController);
		this.view.addChild(viewController.getView());
		this.didAddChildViewController(viewController);

		return true;
	},

	// TODO: Fix this, there is too much duplicated code.
	addChildViewControllerBefore: function(viewController, before) {

		if (this.childViewControllers.contains(viewController) || 
			this.childViewControllers.contains(before) == false)
			return false;

		this.willAddChildViewController(viewController);

		viewController.parentViewControllerWillChange(this);

		if (!viewController.isModal()) {
			if (!viewController.getViewControllerStack()) viewController.setViewControllerStack(this.viewControllerStack);
			if (!viewController.getViewControllerPanel()) viewController.setViewControllerPanel(this.viewControllerPanel);
			if (!viewController.getViewControllerTabs())  viewController.setViewControllerTabs(this.viewControllerTabs);
		}

		viewController.setWindowController(this.windowController);
		viewController.setParentViewController(this);
		viewController.parentViewControllerDidChange(this);

		this.childViewControllers.splice(this.childViewControllers.indexOf(before), 0, viewController);
		this.view.addChild(viewController.getView(), 'before', before.getView());
		this.didAddChildViewController(viewController);

		return true;
	},

	// TODO: Fix this, there is too much duplicated code.
	addChildViewControllerAfter: function(viewController, after) {

		if (this.childViewControllers.contains(viewController) || 
			this.childViewControllers.contains(after) == false)
			return false;

		this.willAddChildViewController(viewController);

		viewController.parentViewControllerWillChange(this);

		if (!viewController.isModal()) {
			if (!viewController.getViewControllerStack()) viewController.setViewControllerStack(this.viewControllerStack);
			if (!viewController.getViewControllerPanel()) viewController.setViewControllerPanel(this.viewControllerPanel);
			if (!viewController.getViewControllerTabs())  viewController.setViewControllerTabs(this.viewControllerTabs);
		}

		viewController.setWindowController(this.windowController);
		viewController.setParentViewController(this);
		viewController.parentViewControllerDidChange(this);

		this.childViewControllers.splice(this.childViewControllers.indexOf(after) + 1, 0, viewController);
		this.view.addChild(viewController.getView(), 'after', after.getView());
		this.didAddChildViewController(viewController);

		return true;
	},

	/**
	 * Returns a child view controller.
	 *
	 * This method will return an child view controller from its own child view
	 * controllers that matches the given name.
	 *
	 * @param {String} name The child view controller name.
	 *
	 * @return {ViewController} The child view controller or `null` if no child
	 *                          view controllers were found.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewController: function(name) {
		return this.childViewControllers.find(function(viewController) {
			return viewController.getName() == name;
		});
	},

	/**
	 * Indicates whether this view controller is the direct owner of a child
	 * view controller.
	 *
	 * @param {ViewController} viewController The view controller.
	 *
	 * @return {Boolean} Whether this view controller owns a given child view
	 *                   controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hasChildViewController: function(viewController) {
		return this.childViewControllers.contains(viewController);
	},

	/**
	 * Return all the child view controllers.
	 *
	 * @return {Array} The child view controllers.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getChildViewControllers: function() {
		return this.childViewControllers;
	},

	/**
	 * Removes a child view controller.
	 *
	 * This method will not destroy the given child view controller upon
	 * removal since it could be added to another view controlelr. If you wish
	 * to destroy the given child view controller, you must do so manually.
	 *
	 * @param {ViewController} viewController The view controller to remove.
	 *
	 * @return {Boolean} Whether the child view controller was successfully
	 *                   removed.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeChildViewController: function(viewController) {

		if (!this.childViewControllers.contains(viewController))
			return false;

		this.willRemoveChildViewController(viewController);

		this.childViewControllers.erase(viewController);

		viewController.parentViewControllerWillChange(null);
		viewController.setWindowController(null);
		viewController.setParentViewController(null);
		viewController.setViewControllerStack(null);
		viewController.setViewControllerPanel(null);
		viewController.setViewControllerTabs(null);

		viewController.parentViewControllerDidChange(null);

		this.didRemoveChildViewController(viewController);

		viewController.getView().removeFromParent();

		return true;
	},

	/**
	 * Removes this view controller from its parent.
	 *
	 * This method will not destroy the given child view controller upon
	 * removal since it could be added to another view controlelr. If you wish
	 * to destroy the given child view controller, you must do so manually.
	 *
	 * @return {Boolean} Whether this view controller was successfully removed
	 *                   from its parent view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeFromParentViewController: function() {
		return this.parentViewController
			 ? this.parentViewController.removeChildViewController(this)
			 : false;
	},

		/**
	 * Presents a modal view controller.
	 *
	 * This method will present a child view controller using a given
	 * transition. The view controller presented as modal will only have a
	 * reference to its parent view controller and will use it to dismiss
	 * the modal view controller.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @param {ViewTransition} viewTransition The view transition.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @see ViewController#dismissModalViewController
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	presentModalViewController: function(viewController, viewTransition) {

		if (this.modalViewController)
			return this;

		this.modalViewController = viewController;
		this.modalViewController.modal = true;

		this.willPresentModalViewController();

		viewController.parentViewControllerWillChange(this);
		viewController.setParentViewController(this);
		viewController.parentViewControllerDidChange(this);

		var viewToShow = this.modalViewController.getView();
		var viewToHide = this.view;
		var parentView = this.view.getParentView();

		parentView.addChild(viewToShow);

		viewTransition = viewTransition || new Moobile.ViewTransition.Cover;
		viewTransition.addEvent('start:once', this.bound('onPresentTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPresentTransitionCompleted'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			parentView
		);

		this.modalViewController.setViewTransition(viewTransition);

		return this;
	},

	onPresentTransitionStart: function() {
		this.modalViewController.viewWillEnter();
	},

	onPresentTransitionCompleted: function() {
		this.modalViewController.viewDidEnter();
		this.didPresentModalViewController()
	},

	/**
	 * Dismisses the current modal view controller.
	 *
	 * This method will dismiss the current modal view controller using the
	 * transition used to present it. The modal view controller will be
	 * destroyed at the end of the transition animation.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	dismissModalViewController: function() {

		if (this.modalViewController == null)
			return this;

		this.willDismissModalViewController()

		var viewToShow = this.view;
		var viewToHide = this.modalViewController.getView();
		var parentView = this.view.getParentView();

		var viewTransition = this.modalViewController.viewTransition;
		viewTransition.addEvent('start:once', this.bound('onDismissTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onDismissTransitionCompleted'));
		viewTransition.leave(
			viewToShow,
			viewToHide,
			parentView
		);

		return this;
	},

	onDismissTransitionStart: function() {
		this.modalViewController.viewWillLeave();
	},

	onDismissTransitionCompleted: function() {
		this.modalViewController.viewDidLeave();
		this.modalViewController.destroy();
		this.modalViewController = null;
		this.didDismissModalViewController();
	},

	/**
	 * Returns the name.
	 *
	 * @return {String} The name.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getName: function() {
		return this.name;
	},

	/**
	 * Sets the title.
	 *
	 * This method will set the title using either a string or an instance of a
	 * `Label`. When provided with a string, this methods creates a `Label`
	 * instance and assign the given string as its text.
	 *
	 * @param {Mixed} title The title as a string or a `Label` instance.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		if (this.title === title)
			return this;

		if (typeof title == 'string') {
			var text = title;
			title = new Moobile.Text();
			title.setText(text);
		}

		var parent = this.title ? this.title.getParent() : null;
		if (parent) {
			parent.replaceChild(this.title, title);
		}

		this.title = title;

		return this;
	},

	/**
	 * Returns the title.
	 *
	 * @return {Text} The title.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this.title;
	},

	/**
	 * Sets the image.
	 *
	 * This method will set the image using either a string or an instance of
	 * an `Image`. When provided with a string, this methods creates an `Image`
	 * instance and assign the given string as its source.
	 *
	 * @param {Mixed} image The image as a string or a `Image` instance.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setImage: function(image) {

		if (this.image === image)
			return this;

		if (typeof image == 'string') {
			var source = image;
			image = new Moobile.Text();
			image.setSource(source);
		}

		var parent = this.image ? this.image.getParent() : null;
		if (parent) {
			parent.replaceChild(this.image, image);
		}

		this.image = image;

		return this;
	},

	/**
	 * Returns the image.
	 *
	 * @return {Image} The image.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getImage: function() {
		return this.image;
	},

	/**
	 * Indicates whether this view controller is modal.
	 *
	 * This method will indicate whether this view controller is modal, meaning
	 * this view controller needs to be dismissed before anything else can
	 * be executed.
	 *
	 * @return {Boolean} Whether this view controller is modal.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isModal: function() {
		return this.modal;
	},

	/**
	 * Indicates whether the managed view is ready.
	 *
	 * This method will indicate whether the managed view is ready, meaning its
	 * element is part of an element that is part of the DOM and can be, for
	 * instance, measured.
	 *
	 * @return {Boolean} Whether the managed view is ready.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isViewReady: function() {
		return this.viewReady;
	},

	/**
	 * Returns the managed view.
	 *
	 * @return {View} The managed view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getView: function() {
		return this.view;
	},

	/**
	 * Sets the view transition.
	 *
	 * This method will store the view transition used to push or present a
	 * view controller then retrieve it to dismiss or pop it. You should seldom
	 * need this method as it's mostly used internally.
	 *
	 * @param {ViewTransition} viewTransition The view transition.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setViewTransition: function(viewTransition) {
		this.viewTransition = viewTransition;
		return this;
	},

	/**
	 * Returns the view transition.
	 *
	 * This method will retrieve the view transition used to push or present a
	 * view controller. You should seldom need this method as it's mostly used
	 * internally.
	 *
	 * @return {ViewTransition} The view transition.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewTransition: function() {
		return this.viewTransition;
	},

	setWindowController: function(windowController) {
		this.windowController = windowController;
		return this;
	},

	getWindowController: function() {
		return this.windowController;
	},

	/**
	 * Sets the view controller stack.
	 *
	 * This method will set a reference of the view controller stack that owns
	 * this view controller. You should seldom need this method as it's mostly
	 * used internally.
	 *
	 * @param {ViewControllerStack} viewControllerStack The view controller
	 *                                                  stack.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setViewControllerStack: function(viewControllerStack) {
		this.viewControllerStack = viewControllerStack;
		return this;
	},

	/**
	 * Returns the view controller stack.
	 *
	 * This method will return a reference of the view controller stack that
	 * owns this view controller. You should seldom need this method as it's
	 * mostly used internally.
	 *
	 * @return {ViewControllerStack} The view controller stack or `null` if
	 *                               this view controller is not owned by a
	 *                               view controller stack.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewControllerStack: function() {
		return this.viewControllerStack;
	},

	/**
	 * Sets the view controller panel.
	 *
	 * This method will set a reference of the view controller panel that owns
	 * this view controller. You should seldom need this method as it's mostly
	 * used internally.
	 *
	 * @param {ViewControllerPanel} viewControllerPanel The view controller
	 *                                                  panel.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setViewControllerPanel: function(viewControllerPanel) {
		this.viewControllerPanel = viewControllerPanel;
		return this
	},

	/**
	 * Returns the view controller panel.
	 *
	 * This method will return a reference of the view controller panel that
	 * owns this view controller. You should seldom need this method as it's
	 * mostly used internally.
	 *
	 * @return {ViewControllerStack} The view controller panel or `null` if
	 *                               this view controller is not owned by a
	 *                               view controller panel.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewControllerPanel: function(viewControllerPanel) {
		return this.viewControllerPanel;
	},

	setViewControllerTabs: function(viewControllerTabs) {
		this.viewControllerTabs = viewControllerTabs;
		return this;
	},

	getViewControllerTabs: function(viewControllerTabs) {
		return this.viewControllerTabs;
	},

	/**
	 * Sets the parent view controller.
	 *
	 * This method will set a reference of the view controller that is a direct
	 * owner of this view controller. You should seldom need this method as
	 * it's mostly used internally.
	 *
	 * @param {ViewController} parentViewController The parent view controller.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setParentViewController: function(parentViewController) {
		this.parentViewController = parentViewController;
		return this;
	},

	/**
	 * Returns the parent view controller.
	 *
	 * This method will return a reference of the view controller that is a
	 * direct owner of this view controller. You should seldom need this method
	 * as it's mostly used internally.
	 *
	 * @return {ViewController} The parent view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getParentViewController: function() {
		return this.parentViewController;
	},

	/**
	 * Tells this view controller a child view controller is about to be added.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The view controller
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willAddChildViewController: function(viewController) {

	},

	/**
	 * Tells this view controller a child view controller has been added.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildViewController: function(viewController) {

	},

	/**
	 * Tells this view controller a child view controller is about to be
	 * removed.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @since 0.1
	 */
	willRemoveChildViewController: function(viewController) {

	},

	/**
	 * Tells this view controller a child view controller has been removed.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @since 0.1
	 */
	didRemoveChildViewController: function(viewController) {

	},

	/**
	 * Tells this view controller its parent view controller is about to change.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The parent view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerWillChange: function(viewController) {

	},

	/**
	 * Tells this view controller its parent view controller has changed.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The parent view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewControllerDidChange: function(viewController) {

	},

	/**
	 * Tells this view controller its about to present a modal view controller.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willPresentModalViewController: function() {

	},

	/**
	 * Tells this view controller it has presented a modal view controller.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didPresentModalViewController: function() {

	},

	/**
	 * Tells this view controller its about to dismiss a modal view controller.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willDismissModalViewController: function() {

	},

	/**
	 * Tells this view controller it has dismissed a modal view controller.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didDismissModalViewController: function() {

	},

	/**
	 * Tells this view controller its orientation changed.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {String} orientation The orientation, `portrait` or `landscape`.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRotateToOrientation: function(orientation) {

	},

	/**
	 * Tells this view controller its managed view was loaded.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewDidLoad: function() {

	},

	/**
	 * Tells this view controller its managed view became ready.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewDidBecomeReady: function() {

	},

	/**
	 * Tells this view controller its managed view is about to enter the screen
	 * and become the visible view of its hierarchy.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewWillEnter: function() {

	},

	/**
	 * Tells this view controller its managed view enterd the screen and became
	 * the visible view of its hierarchy.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @since 0.1
	 */
	viewDidEnter: function() {

	},

	/**
	 * Tells this view controller its managed view is about to leave the screen
	 * and become the hidden.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @since 0.1
	 */
	viewWillLeave: function() {

	},

	/**
	 * Tells this view controller its managed view is left the screen and
	 * became hidden.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @since 0.1
	 */
	viewDidLeave: function() {

	},

	/**
	 * Destroys this view controller.
	 *
	 * This method will destroy this view controller's managed view and all its
	 * child view controllers.
	 *
	 * If you override this method, make sure you call the parent method at
	 * the end of your implementation.
	 *
	 * @return {EventDispatcher} This child.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		window.removeEvent('rotate', this.bound('onWindowRotate'));

		this.destroyChildViewControllers();

		this.view.destroy();
		this.view = null;

		this.viewTransition = null;
		this.viewControllerStack = null;
		this.viewControllerPanel = null;
		this.parentViewController = null;
	},

	destroyChildViewControllers: function() {
		this.childViewControllers.each(this.bound('destroyChildViewController'));
		this.childViewControllers.empty();
	},

	destroyChildViewController: function(viewController) {
		viewController.destroy();
		viewController = null;
	},

	onWindowRotate: function(e) {
		this.didRotateToOrientation(e.orientationName);
	},

	onViewReady: function() {
		this.viewReady = true;
		this.viewDidBecomeReady();
	}

});
