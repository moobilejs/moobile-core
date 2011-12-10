/*
---

name: ViewController

description: Manages a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core/Class
	- Core/Class.Extras
	- Core/Event
	- Core/Element
	- Core/Element.Event
	- Class-Extras/Class.Binds
	- Class.Instantiate
	- Class.Mutator.Property
	- Event.Loaded

provides:
	- ViewController

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * @name  View
 * @class Provides an object used to manage a view.
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

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * @var    {String} This view controller's name.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	name: null,

	/**
	 * @var    {Label} This view controller's title.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	title: null,

	/**
	 * @var    {Image} This view controller's image.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	image: null,

	/**
	 * @var    {Boolean} Whether this view controller is modal.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	modal: false,

	/**
	 * @var    {View} This view controller's managed view.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	view: null,

	/**
	 * @var    {Boolean} Whether this view controller's view is ready.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewReady: false,

	/**
	 * @var    {ViewTransition} This view controller's view transition.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewTransition: null,

	/**
	 * @var    {ViewControllerStack} This view controller's view controller stack.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewControllerStack: null,

	/**
	 * @var    {ViewControllerPanel} This view controller's view controller panel.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	viewControllerPanel: null,

	/**
	 * @var    {ViewController} This view controller's parent view controller.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentViewController: null,

	/**
	 * @var    {ViewController} The modal view controller being presented.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	modalViewController: null,

	/**
	 * @var    {Array} This view controller's child view controllers.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	childViewControllers: [],

	/**
	 * Initialize this view controller.
	 *
	 * This method will initialize this view controller by calling the
	 * `loadView` method.
	 *
	 * If you override this method, make sure you call the parent method at
	 * the beginning of your implementation.
	 *
	 * @param {Object} options This view controller's options.
	 * @param {String} name    this view controller's name.
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
		}

		return this;
	},

	/**
	 * Loads the view.
	 *
	 * This method has to be overridden and needs to create a view instance in
	 * the `view` property of this class. This method does not require a call
	 * to its parent method.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	loadView: function() {
		this.view = new Moobile.View();
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
	 * @return {Entity} This entity.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

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

	/**
	 * Adds a child view controller.
	 *
	 * This method adds the child view controller'S view at the bottom of its
	 * view. You may specify the location of the child view controller's view
	 * using the `where` parameter combined with the optional `context`
	 * parameter.
	 *
	 * If specified, the child view controller's view can be added at the `top`
	 * or `bottom` of this view controller's view or `before` or `after` this
	 * view controller's view. If an element is given as the `context`, the
	 * location will be relative to this element.
	 *
	 * @param {ViewController} viewController The child view controller.
	 * @param {String}         where          The child view controller
	 *                                        location.
	 * @param {Element}        context        The child view controller
	 *                                        location context element.
	 *
	 * @return {Boolean} Whether the child view controller was successfully
	 *                   added.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addChildViewController: function(viewController, where, context) {

		if (this.childViewControllers.contains(viewController))
			return false;

		this.willAddChildViewController(viewController);

		viewController.parentViewControllerWillChange(this);

		if (!viewController.isModal()) {
			if (!viewController.getViewControllerStack()) viewController.setViewControllerStack(this.viewControllerStack);
			if (!viewController.getViewControllerPanel()) viewController.setViewControllerPanel(this.viewControllerPanel);
		}

		viewController.setParentViewController(this);
		viewController.parentViewControllerDidChange(this);

		this.childViewControllers.push(viewController);
		this.view.addChild(viewController.getView(), where, context);
		this.didAddChildViewController(viewController);

		return true;
	},

	/**
	 * Returns a child view controller.
	 *
	 * This method will attempt to return a child view controller using the
	 * given name or `null` if no child view controllers were found.
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
	 * Indicates whether this view controller is the parent of a given child
	 * view controller.
	 *
	 * @param {ViewController} viewController The view controller.
	 *
	 * @return {Boolean} Whether this view controller is the parent of the
	 *                   given child view controller.
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
	 * This method will not destroy the child view controller upon removal, you
	 * must do it manually to free memory.
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
		viewController.setViewControllerStack(null);
		viewController.setViewControllerPanel(null);
		viewController.setParentViewController(null);
		viewController.parentViewControllerDidChange(null);

		this.didRemoveChildViewController(viewController);

		viewController.getView().removeFromOwner();

		return true;
	},

	/**
	 * Removes this view controller from its parent.
	 *
	 * This method does not destroy the child view controller upon removal, you
	 * must do it manually to free memory.
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
	 * Presents a modal view controller using a view transition.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @param {ViewTransition} viewTransition The view transition.
	 *
	 * @return {ViewController} This view controller.
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

		var viewToShow = this.modalViewController.getView();
		var viewToHide = this.view;
		var parentView = this.view.getOwnerView();

		this.addChildViewController(this.modalViewController, 'after', viewToHide);

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

	/**
	 * Dismisses the current modal view controller.
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
		var parentView = this.view.getOwnerView();

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

	/**
	 * Returns this view controller's name.
	 *
	 * @return {String} This view controller's name.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getName: function() {
		return this.name;
	},

	/**
	 * Sets this view controller's title.
	 *
	 * @param {Mixed} title This view controller's title.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {
		this.title = title;
		return this;
	},

	/**
	 * Returns this view controller title.
	 *
	 * @return {Label} This view controller's title.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this.title;
	},

	/**
	 * Sets this view controller's image.
	 *
	 * @param {Mixed} image This view controller's image.
	 *
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setImage: function(image) {
		this.image = image;
	},

	/**
	 * Returns this view controller's title.
	 *
	 * @return {Image} This view controller's image.
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
	 * @return {Boolean} Whether this view controller is modal.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isModal: function() {
		return this.modal;
	},

	/**
	 * Indicates whether this view controller's managed view is ready.
	 *
	 * @return {Boolean} Whether this view controller's managed view is ready.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	isViewReady: function() {
		return this.viewReady;
	},

	/**
	 * Returns this view controller's managed view.
	 *
	 * @return {View} Thsi view controller's managed view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getView: function() {
		return this.view;
	},

	/**
	 * Sets the view transition used for the view.
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
	 * Returns the view transition used for the view.
	 *
	 * @return {ViewTransition} The view transition.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewTransition: function() {
		return this.viewTransition;
	},

	/**
	 * Sets the view controller stack.
	 *
	 * @param {ViewControllerStack} viewControllerStack The view controller stack.
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
	 * @return {ViewControllerStack} The view controller stack.
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
	 * @param {ViewControllerPanel} viewControllerPanel The view controller panel.
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
	 * @return {ViewController} This view controller.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getViewControllerPanel: function(viewControllerPanel) {
		return this.viewControllerPanel;
	},

	/**
	 * Sets the parent view controller.
	 *
	 * @param {ViewController} parentViewController The view controller.
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

	onViewReady: function() {
		this.viewReady = true;
		this.viewDidBecomeReady();
	},

	onPresentTransitionStart: function() {
		this.modalViewController.viewWillEnter();
	},

	onPresentTransitionCompleted: function() {
		this.modalViewController.viewDidEnter();
		this.didPresentModalViewController()
	},

	onDismissTransitionStart: function() {
		this.modalViewController.viewWillLeave();
	},

	onDismissTransitionCompleted: function() {
		this.modalViewController.viewDidLeave();
		this.modalViewController.removeFromParentViewController();
		this.modalViewController.destroy();
		this.modalViewController = null;
		this.didDismissModalViewController();
	}

});
