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

	window: null,

	name: null,

	title: null,

	ready: false,

	modal: false,

	view: null,

	viewLoaded: false,

	viewTransition: null,

	viewControllerStack: null,

	viewControllerPanel: null,

	parentViewController: null,

	modalViewController: null,

	childViewControllers: [],

	_viewRequest: null,

	initialize: function(source, options, name) {

		this.name = name;

		this.window = Moobile.Window.getInstance();

		this.setOptions(options);

		var element = document.id(source);
		if (element) {
			this.loadViewWith(element);
			return this;
		}

		if (source) {
			this.loadViewFrom(source);
			return this;
		}

		this.loadViewWith(new Element('div'));

		return this;
	},

	loadView: function(viewElement) {
		this.view = Class.instantiate(
			viewElement.get('data-view') || 'Moobile.View',
			viewElement
		);
	},

	loadViewWith: function(element) {
		this.loadView(element);
		this.viewDidLoad();
		this.viewLoaded = true;
		this.fireEvent('viewload');
	},

	loadViewFrom: function(source) {
		if (this._viewRequest == null) {
			this._viewRequest = new Moobile.Request.View()
		}
		this._viewRequest.cancel();
		this._viewRequest.load(source, this.bound('loadViewWith'));
	},

	attachEvents: function() {

	},

	detachEvents: function() {

	},

	startup: function() {

		if (this.ready == true)
			return this;

		this.ready = true;

		this.setup();
		this.attachEvents();
	},

	destroy: function() {

		if (this.ready == false)
			return this;

		this.ready = false;

		this.detachEvents();
		this.teardown();
		this.destroyChildViewControllers();

		this.view.destroy();
		this.view = null;
		this.window = null;

		this.viewTransition = null;
		this.viewControllerStack = null;
		this.viewControllerPanel = null;
		this.parentViewController = null;
	},

	setup: function() {

	},

	teardown: function() {

	},

	presentModalViewController: function(viewController, viewTransition) {
		
		if (this.modalViewController)
			return this;

		this.window.disableInput();

		if (viewController.isViewLoaded() == false) {
			viewController.addEvent('viewload:once', function() {
				this.presentModalViewController(viewController, viewTransition);
			}.bind(this));
			return this;
		}
		
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
		this.window.enableInput();
	},

	dismissModalViewController: function() {

		if (this.modalViewController == null)
			return this;

		this.window.disableInput();

		this.willDismissModalViewController()

		var viewToShow = this.view;
		var viewToHide = this.modalViewController.getView();

		var viewTransition = this.modalViewController.viewTransition;
		viewTransition.addEvent('start:once', this.bound('onDismissTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onDismissTransitionCompleted'));
		viewTransition.leave(
			viewToShow,
			viewToHide,
			this.window
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
		this.window.enableInput();	
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

		if (viewController.isViewLoaded() == false) {
			viewController.addEvent('viewload:once', function() {
				this.addChildViewController(viewController, where, context);
			}.bind(this));
			return this;
		}

		this.view.addChild(viewController.getView(), where, context);

		if (viewController.isModal() == false) {
			viewController.setViewControllerStack(this.viewControllerStack);
			viewController.setViewControllerPanel(this.viewControllerPanel);
		}

		this.willAddChildViewController(viewController);
		
		this.childViewControllers.push(viewController);
		
		viewController.setParentViewController(this);
		viewController.startup();
		
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

	isReady: function() {
		return this.ready;
	},

	isModal: function() {
		return this.modal;
	},

	isViewLoaded: function() {
		return this.viewLoaded;
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

	viewWillEnter: function() {

	},

	viewDidEnter: function() {

	},

	viewWillLeave: function() {

	},

	viewDidLeave: function() {

	}

});