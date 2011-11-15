/*
---

name: ViewController

description: Provides a way to handle the different states and events of a view.

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

Moobile.ViewController = new Class({

	Implements: [
		Events,
		Options,
		Class.Binds
	],

	name: null,

	title: null,

	modal: false,

	view: null,

	viewLoaded: false,
	
	viewReady: false,

	viewTransition: null,

	viewControllerStack: null,

	viewControllerPanel: null,

	parentViewController: null,

	modalViewController: null,

	childViewControllers: [],

	initialize: function(options, name) {
		
		this.name = name;
		
		this.setOptions(options);
		
		this.loadView();
		this.setViewLoaded();
	
		return this;
	},

	loadView: function(viewElement) {
		this.view = new Moobile.View();
	},

	destroy: function() {
		
		this.destroyChildViewControllers();

		this.view.destroy();
		this.view = null;
		this.viewDidUnload();

		this.viewTransition = null;
		this.viewControllerStack = null;
		this.viewControllerPanel = null;
		this.parentViewController = null;
	},

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

	onPresentTransitionStart: function() {
		this.modalViewController.viewWillEnter();
	},

	onPresentTransitionCompleted: function() {
		this.modalViewController.viewDidEnter();
		this.didPresentModalViewController()
	},

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

	onDismissTransitionStart: function() {
		this.modalViewController.viewWillLeave();
	},

	onDismissTransitionCompleted: function() {
		this.modalViewController.viewDidLeave();
		this.modalViewController.removeFromParentViewController();
		this.modalViewController.destroy();
		this.modalViewController = null;
		this.didDismissModalViewController();
	},

	destroyChildViewControllers: function() {
		this.childViewControllers.each(this.bound('destroyChildViewController'));
		this.childViewControllers.empty();
		return this;
	},

	destroyChildViewController: function(viewController) {
		viewController.destroy();
		viewController = null;
		return this;
	},

	addChildViewController: function(viewController, where, context) {
	
		this.willAddChildViewController(viewController);
		
		this.view.addChild(viewController.getView(), where, context);
		
		if (viewController.isModal() == false) {
			viewController.setViewControllerStack(this.viewControllerStack);
			viewController.setViewControllerPanel(this.viewControllerPanel);
		}

		viewController.setParentViewController(this);
		
		this.childViewControllers.push(viewController);
	
		this.didAddChildViewController(viewController);

		return this;
	},

	getChildViewController: function(name) {
		return this.childViewControllers.find(function(viewController) {
			return viewController.getName() == name;
		});
	},

	getChildViewControllers: function() {
		return this.childViewControllers;
	},

	removeChildViewController: function(viewController) {

		var exists = this.childViewControllers.contains(viewController);
		if (exists == false)
			return this;

		this.willRemoveChildViewController(viewController);
		
		this.childViewControllers.erase(viewController);
		
		viewController.setViewControllerStack(null);
		viewController.setViewControllerPanel(null);
		viewController.setParentViewController(null);
		
		this.didRemoveChildViewController(viewController);

		viewController.getView().removeFromParent();

		return this;
	},

	removeFromParentViewController: function() {
		if (this.parentViewController) {
			this.parentViewController.removeChildViewController(this);
		}
		return this;
	},
	
	getName: function() {
		return this.name;
	},

	setTitle: function(title) {
		this.title = title;
		return this;
	},

	getTitle: function() {
		return this.title == null ? 'Untitled' : this.title;
	},

	isModal: function() {
		return this.modal;
	},

	setViewLoaded: function()  {
		
		if (this.viewLoaded)
			return this;
		
		this.view.addEvent('ready', this.bound('setViewReady'));
		this.viewLoaded = true;
		this.viewDidLoad();		
		
		this.fireEvent('viewLoad');	
		
		return this;		
	},

	isViewLoaded: function() {
		return this.viewLoaded;
	},

	setViewReady: function() {
		
		if (this.viewReady)
			return this;
		
		this.view.removeEvent('ready', this.bound('setViewReady'));
		this.viewReady = true;
		this.viewDidBecomeReady();
		
		this.fireEvent('viewReady');
		
		return this;
	},

	isViewReady: function() {
		return this.viewReady;
	},

	getView: function() {
		return this.view;
	},

	setViewTransition: function(viewTransition) {
		this.viewTransition = viewTransition;
		return this;
	},

	getViewTransition: function() {
		return this.viewTransition;
	},

	setViewControllerStack: function(viewControllerStack) {
		this.viewControllerStack = viewControllerStack;
		return this;
	},

	getViewControllerStack: function() {
		return this.viewControllerStack;
	},

	setViewControllerPanel: function(viewControllerPanel) {
		this.viewControllerPanel = viewControllerPanel;
		return this
	},

	getViewControllerPanel: function(viewControllerPanel) {
		return this.viewControllerPanel;
	},

	setParentViewController: function(parentViewController) {
		this.parentViewController = parentViewController;
		return this;
	},
	
	getParentViewController: function() {
		return this.parentViewController;
	},

	willAddChildViewController: function(viewController) {

	},

	didAddChildViewController: function(viewController) {

	},

	willRemoveChildViewController: function(viewController) {

	},

	didRemoveChildViewController: function(viewController) {

	},

	willPresentModalViewController: function() {

	},
	
	didPresentModalViewController: function() {

	},
	
	willDismissModalViewController: function() {

	},
	
	didDismissModalViewController: function() {

	},

	viewDidLoad: function() {

	},
	
	viewDidUnload: function() {
		
	},
	
	viewDidBecomeReady: function() {
		
	},

	viewWillEnter: function() {

	},

	viewDidEnter: function() {

	},

	viewWillLeave: function() {

	},

	viewDidLeave: function() {

	}

});
