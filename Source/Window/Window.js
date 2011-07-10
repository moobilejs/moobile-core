/*
---

name: Window

description: Provides the area where the views will be stored and displayed.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- View

provides:
	- Window

...
*/

Moobile.Window = new Class({

	Extends: Moobile.View,
	
	viewController: null,
	
	rootViewController: null,

	userInputEnabled: true,

	userInputMask: null,

	options: {
		className: 'window'
	},

	init: function() {
		this.viewController = new Moobile.ViewControllerCollection(this);
		this.viewController.startup();
		this.parent();
		return this;
	},

	release: function() {
		this.viewController.destroy();
		this.viewController = null;
		this.parent();
		return this;
	},

	filterChildView: function(element) {
		return element.getParent('[data-role=view]') == null;
	},

	setRootViewController: function(rootViewController) {

		if (this.rootViewController) {
			this.viewController.removeViewController(this.rootViewController);
			this.rootViewController.view.destroy();
			this.rootViewController.view = null;
			this.rootViewController.destroy();
			this.rootViewController = null;
		}

		this.viewController.addViewController(rootViewController);

		this.rootViewController = rootViewController;

		return this;
	},

	getRootViewController: function() {
		return this.rootViewController || this.viewController.getViewControllers()[0];
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
	},
	
	didBindChildView: function(view) {
		view.setWindow(this);
		view.setParentView(null);
		this.parent(view);
		return this;
	},	

});