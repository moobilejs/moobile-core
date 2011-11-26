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
 * Manages a view.
 *
 * @name ViewController
 * @class ViewController
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewController = new Class( /** @lends ViewController.prototype */ {

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	/**
	 * The view controller name.
	 * @type {String}
	 */
	name: null,

	/**
	 * The view controller title.
	 * @type {String}
	 */
	title: null,

	/**
	 * The view controller image.
	 * @type {String}
	 */
	image: null,

	/**
	 * Whether this view controller is modal.
	 * @type {Boolean}
	 */
	modal: false,

	/**
	 * The view managed by the view controller.
	 * @type {View}
	 */
	view: null,

	/**
	 * Whether the view is ready.
	 * @type {Boolean}
	 */
	viewReady: false,

	/**
	 * The view transition that was used for the view.
	 * @type {ViewTransition}
	 */
	viewTransition: null,

	/**
	 * The view controller stack that owns this view controller.
	 * @type {ViewControllerStack}
	 */
	viewControllerStack: null,

	/**
	 * The view controller panel that owns this view controller.
	 * @type {ViewControllerPanel}
	 */
	viewControllerPanel: null,

	/**
	 * The parent view controller.
	 * @type {ViewController}
	 */
	parentViewController: null,

	/**
	 * The modal view controller current being presented.
	 * @type {ViewController}
	 */
	modalViewController: null,

	/**
	 * The child view controllers.
	 * @type {Array}
	 */
	childViewControllers: [],

	/**
	 * Initialize this view controller.
	 * @param {Object} options The view controller options.
	 * @param {String} name The view controller name.
	 * @return {ViewController}
	 * @since 0.1
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
	 * Load the view. You must override this method and load the proper view
	 * in the view attribute of this class.
	 * @since 0.1
	 */
	loadView: function() {
		this.view = new Moobile.View();
	},

	/**
	 * Destroy this view controller and its hierarchy.
	 * @since 0.1
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

	/**
	 * @private
	 */
	destroyChildViewControllers: function() {
		this.childViewControllers.each(this.bound('destroyChildViewController'));
		this.childViewControllers.empty();
	},

	/**
	 * @private
	 */
	destroyChildViewController: function(viewController) {
		viewController.destroy();
		viewController = null;
	},

	/**
	 * Add a child view controller at a specific location.
	 * @param {ViewController} viewController The view controller.
	 * @param {String} where The location passed to the view addChild method.
	 * @param {String} context The context passed to the view addChild method.
	 * @return {Boolean}
	 * @since 0.1
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
	 * Indicate whether a view controller is a direct child of this
	 * view controller.
	 * @param {ViewController} viewController The view controller.
	 * @return {Boolean}
	 * @since 0.1
	 */
	hasChildViewController: function(viewController) {
		return this.childViewControllers.contains(viewController);
	},

	/**
	 * Return a child view controller by its name.
	 * @param {String} name The view controller name.
	 * @return {ViewController}
	 * @since 0.1
	 */
	getChildViewController: function(name) {
		return this.childViewControllers.find(function(viewController) {
			return viewController.getName() == name;
		});
	},

	/**
	 * Return all child view controllers.
	 * @return {Array}
	 * @since 0.1
	 */
	getChildViewControllers: function() {
		return this.childViewControllers;
	},

	/**
	 * Remove a child view controller without destroying it.
	 * @param {ViewController} viewController The view controller to remove.
	 * @return {Boolean}
	 * @since 0.1
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
	 * Remove a child view controller from its parent without destroying it.
	 * @return {Boolean}
	 * @since 0.1
	 */
	removeFromParentViewController: function() {
		return this.parentViewController
			 ? this.parentViewController.removeChildViewController(this)
			 : false;
	},

	/**
	 * Present a modal view controller using a view transition.
	 * @param {ViewController} viewController The view controller.
	 * @param {ViewTransition} viewTransition The view transition.
	 * @return {ViewController}
	 * @since 0.1
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
	 * Dismiss the current modal view controller.
	 * @return {ViewController}
	 * @since 0.1
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
	 * Return the name of this view controller.
	 * @return {String}
	 * @since 0.1
	 */
	getName: function() {
		return this.name;
	},

	/**
	 * Set the view controller title.
	 * @param {String} title The title.
	 * @return {ViewController}
	 * @since 0.1
	 */
	setTitle: function(title) {
		this.title = title;
		return this;
	},

	/**
	 * Return the view controller title.
	 * @return {String}
	 * @since 0.1
	 */
	getTitle: function() {
		return this.title;
	},

	/**
	 * Set the view controller image.
	 * @param {String} image The image.
	 * @return {ViewController}
	 * @since 0.1
	 */
	setImage: function(image) {
		this.image = image;
	},

	/**
	 * Return the view controller title.
	 * @return {String}
	 * @since0 .1
	 */
	getImage: function() {
		return this.image;
	},

	/**
	 * Indicates whether this view controller is modal.
	 * @return {Boolean}
	 * @since 0.1
	 */
	isModal: function() {
		return this.modal;
	},

	/**
	 * Indicates whether the view controller view is ready.
	 * @return {Boolean}
	 * @since 0.1
	 */
	isViewReady: function() {
		return this.viewReady;
	},

	/**
	 * Return the view controller view.
	 * @return {View}
	 * @since 0.1
	 */
	getView: function() {
		return this.view;
	},

	/**
	 * Set the view transition used for the view.
	 * @param {ViewTransition} viewTransition The view transition.
	 * @return {ViewController}
	 * @private
	 * @since 0.1
	 */
	setViewTransition: function(viewTransition) {
		this.viewTransition = viewTransition;
		return this;
	},

	/**
	 * Return the view transition used for the view.
	 * @return {ViewTransition}
	 * @private
	 * @since 0.1
	 */
	getViewTransition: function() {
		return this.viewTransition;
	},

	/**
	 * Set the view controller stack.
	 * @param {ViewControllerStack} viewControllerStack The view controller stack.
	 * @return {ViewController}
	 * @private
	 * @since 0.1
	 */
	setViewControllerStack: function(viewControllerStack) {
		this.viewControllerStack = viewControllerStack;
		return this;
	},

	/**
	 * Return the view controller stack.
	 * @return {ViewControllerStack}
	 * @since 0.1
	 */
	getViewControllerStack: function() {
		return this.viewControllerStack;
	},

	/**
	 * Set the view controller panel.
	 * @param {ViewControllerPanel} viewControllerPanel The view controller panel.
	 * @return {ViewController}
	 * @private
	 * @since 0.1
	 */
	setViewControllerPanel: function(viewControllerPanel) {
		this.viewControllerPanel = viewControllerPanel;
		return this
	},

	/**
	 * Return the view controller panel.
	 * @return {ViewControllerPanel}
	 * @since 0.1
	 */
	getViewControllerPanel: function(viewControllerPanel) {
		return this.viewControllerPanel;
	},

	/**
	 * Set the parent view controller.
	 * @param {ViewController} parentViewController The view controller.
	 * @return {ViewController}
	 * @private
	 * @since 0.1
	 */
	setParentViewController: function(parentViewController) {
		this.parentViewController = parentViewController;
		return this;
	},

	/**
	 * Return the parent view controller.
	 * @return {ViewController} The parent view controller.
	 * @since 0.1
	 */
	getParentViewController: function() {
		return this.parentViewController;
	},

	/**
	 * Called by the view controller before a view controller is added as a
	 * child view controller.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @since 0.1
	 */
	willAddChildViewController: function(viewController) {

	},

	/**
	 * Called by the view controller after a view controller has been added as
	 * a child view controller.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The view controller.
	 * @since 0.1
	 */
	didAddChildViewController: function(viewController) {

	},

	/**
	 * Called by the view controller before a view controller is removed from
	 * this view controller.
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
	 * Called by the view controller after a view controller has been removed
	 * from this view controller.
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
	 * Called by the view controller before the view controller that owns this
	 * view controller changes.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The parent view controller.
	 * @since 0.1
	 */
	parentViewControllerWillChange: function(viewController) {

	},

	/**
	 * Called by the view controller after the view controller that owns this
	 * view controller changed.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @param {ViewController} viewController The parent view controller.
	 * @since 0.1
	 */
	parentViewControllerDidChange: function(viewController) {

	},

	/**
	 * Called by the view controller before presenting a modal view controller.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @since 0.1
	 */
	willPresentModalViewController: function() {

	},

	/**
	 * Called by the view controller after presenting a modal view controller.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @since 0.1
	 */
	didPresentModalViewController: function() {

	},

	/**
	 * Called by the view controller before dismissing a modal view controller.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @since 0.1
	 */
	willDismissModalViewController: function() {

	},

	/**
	 * Called by the view controller after dismissing a modal view controller.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @since 0.1
	 */
	didDismissModalViewController: function() {

	},

	/**
	 * Called by the view controller when the view managed by this view
	 * controller becomes ready and is for instance measurable.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @since 0.1
	 */
	viewDidBecomeReady: function() {

	},

	/**
	 * Called by the view controller stack before the view managed by this
	 * view controller enters the screen using a view transition.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent as the implementation of this method
	 * may change in the future.
	 *
	 * @since 0.1
	 */
	viewWillEnter: function() {

	},

	/**
	 * Called by the view controller stack after the view managed by this
	 * view controller enters the screen using a view transition.
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
	 * Called by the view controller stack before the view managed by this
	 * view controller leaves the screen using a view transition.
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
	 * Called by the view controller stack after the view managed by this
	 * view controller leaves the screen using a view transition.
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
	 * View ready event handler.
	 * @since 0.1
	 * @ignore
	 */
	onViewReady: function() {
		this.viewReady = true;
		this.viewDidBecomeReady();
	},

	/**
	 * Present modal view controller transition start event handler.
	 * @since 0.1
	 * @ignore
	 */
	onPresentTransitionStart: function() {
		this.modalViewController.viewWillEnter();
	},

	/**
	 * Present modal view controller transition completed event handler.
	 * @since 0.1
	 * @ignore
	 */
	onPresentTransitionCompleted: function() {
		this.modalViewController.viewDidEnter();
		this.didPresentModalViewController()
	},

	/**
	 * Dismiss modal view controller transition start event handler.
	 * @since 0.1
	 * @ignore
	 */
	onDismissTransitionStart: function() {
		this.modalViewController.viewWillLeave();
	},

	/**
	 * Dismiss modal view controller transition completed event handler.
	 * @since 0.1
	 * @ignore
	 */
	onDismissTransitionCompleted: function() {
		this.modalViewController.viewDidLeave();
		this.modalViewController.removeFromParentViewController();
		this.modalViewController.destroy();
		this.modalViewController = null;
		this.didDismissModalViewController();
	}

});
