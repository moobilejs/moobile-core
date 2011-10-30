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

	loadView: function(viewElement) {
		this.view = Class.instantiate(
			viewElement.get('data-class') || 'Moobile.View',
			viewElement
		);
		return this;
	},

	loadViewWith: function(element) {
		this.loadView(element);
		this.viewDidLoad();
		this.viewLoaded = true;
		this.fireEvent('viewload');
		return this;
	},

	loadViewFrom: function(source) {
		if (this._viewRequest == null) {
			this._viewRequest = new Moobile.Request.View()
		}
		this._viewRequest.cancel();
		this._viewRequest.load(source, this.bound('loadViewWith'));
		return this;
	},

	attachEvents: function() {
  		return this;
	},

	detachEvents: function() {
		return this;
	},

	startup: function() {

		if (this.ready == true)
			return this;

		this.ready = true;

		this.setup();
		this.attachEvents();

		return this;
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

		return this;
	},

	setup: function() {
		return this;
	},

	teardown: function() {
		return this;
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
		
		this.addChildController(this.modalViewController, 'bottom', this.window.getContent());

		var viewToShow = this.modalViewController.getView();
		var viewToHide = this.window.getRootView();

		viewTransition = viewTransition || new Moobile.ViewTransition.Cover;
		viewTransition.addEvent('start:once', this.bound('onPresentTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('onPresentTransitionCompleted'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			this.window
		);

		this.modalViewController.setViewTransition(viewTransition);

		return this;
	},

	onPresentTransitionStart: function() {
		this.modalViewController.viewWillEnter();
		return this;
	},

	onPresentTransitionCompleted: function() {
		this.modalViewController.viewDidEnter();
		this.didPresentModalViewController()
		this.window.enableInput();
		return this;
	},

	dismissModalViewController: function() {

		if (this.modalViewController == null)
			return this;

		this.window.disableInput();

		this.willDismissModalViewController()

		var viewToShow = this.window.getRootView();
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
		this.removeChildViewController(this.modalViewController);
		this.modalViewController.destroy();
		this.modalViewController = null;
		this.didDismissModalViewController();
		this.window.enableInput();	
		return this;
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

	addChildController: function(viewController, where, context) {

		if (viewController.isViewLoaded() == false) {
			viewController.addEvent('viewload:once', function() {
				this.addChildController(viewController, where, context);
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

	willAddChildViewController: function(viewController) {
		return this;
	},

	didAddChildViewController: function(viewController) {
		return this;
	},

	willRemoveChildViewController: function(viewController) {
		return this;
	},

	didRemoveChildViewController: function(viewController) {
		return this;
	},

	willPresentModalViewController: function() {
		return this;
	},
	
	didPresentModalViewController: function() {
		return this;
	},
	
	willDismissModalViewController: function() {
		return this;
	},
	
	didDismissModalViewController: function() {
		return this;
	},

	viewDidLoad: function() {
		return this;
	},

	viewWillEnter: function() {
		return this;
	},

	viewDidEnter: function() {
		return this;
	},

	viewWillLeave: function() {
		return this;
	},

	viewDidLeave: function() {
		return this;
	}

});