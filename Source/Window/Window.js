/*
---

name: Window

description: Provides the area where the views will be stored and displayed.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- View

provides:
	- Window

...
*/

Moobile.Window = new Class({

	Extends: Moobile.View,

	viewController: null,

	viewControllerCollection: null,

	userInputEnabled: true,

	userInputMask: null,

	options: {
		className: 'window',
		withWrapperElement: false,
		withContentElement: false
	},

	init: function() {
		this.viewControllerCollection = new Moobile.ViewControllerCollection(this);
		this.viewControllerCollection.startup();
		this.parent();
		return this;
	},

	release: function() {
		this.viewControllerCollection.destroy();
		this.viewControllerCollection = null;
		this.parent();
		return this;
	},

	didBindChildView: function(view) {
		view.setWindow(this);
		view.setParentView(null);
		this.parent(view);
		return this;
	},

	filterChildView: function(element) {
		return element.getParent('[data-role=view]') == null;
	},

	setViewController: function(viewController) {

		if (this.viewController) {
			this.viewControllerCollection.removeViewController(this.viewController);
			this.viewController.view.destroy();
			this.viewController.view = null;
			this.viewController.destroy();
			this.viewController = null;
		}

		this.viewControllerCollection.addViewController(viewController);

		this.viewController = viewController;

		return this;
	},

	getViewController: function() {
		return this.viewController || this.viewControllerCollection.getViewControllers()[0];
	},

	getOrientation: function() {
		var o = Math.abs(window.orientation);
		switch (o) {
			case  0: return 'portrait';
			case 90: return 'landscape';
		}
	},

	enableUserInput: function() {
		if (this.userInputEnabled == false) {
			this.userInputEnabled = true;
			this.destroyUserInputMask();
		}
		return this;
	},

	disableUserInput: function() {
		if (this.userInputEnabled == true) {
			this.userInputEnabled = false;
			this.injectUserInputMask();
		}
	},

	isUserInputEnabled: function() {
		return this.userInputEnabled;
	},

	injectUserInputMask: function() {
		this.userInputMask = new Element('div.' + this.options.className + '-mask');
		this.userInputMask.inject(this.element);
		return this;
	},

	destroyUserInputMask: function() {
		this.userInputMask.destroy();
		this.userInputMask = null;
		return this;
	}

});