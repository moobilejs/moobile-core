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

	options: {
		className: 'window'
	},

	initialize: function(element, options) {
		this.setElement(element);
		this.setOptions(options);
		this.element.addClass(this.options.className);
		return this;
	},

	setViewController: function(viewController) {
		this.empty();
		this.viewController = viewController;
		this.addChildView(this.viewController.view);
		this.viewController.view.setParentView(null);
		this.viewController.view.setWindow(this);
		this.viewController.doStartup();
		this.viewController.viewWillEnter();
		this.viewController.viewDidEnter();
		return this;
	},

	getViewController: function() {
		return this.viewController;
	},

	adopt: function() {
		this.element.adopt.apply(this.element, arguments);
		return this;
	}

});