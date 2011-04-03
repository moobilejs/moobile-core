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

	mask: null,

	options: {
		className: 'window',
		wrapper: true,
		content: true
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

	disableUserInput: function() {

		if (this.mask == null) {
			this.mask = new Element('div');
			this.mask.setStyle('opacity', 0);
			this.mask.setStyle('background-color', '#ffffff');
		}

		var size = this.element.getSize();
		this.mask.setStyle('width', size.x);
		this.mask.setStyle('height', size.y);
		this.mask.setStyle('position', 'absolute');
		this.mask.setStyle('top', 0);
		this.mask.setStyle('left', 0);

		this.adopt(this.mask);

		return this;
	},

	enableUserInput: function() {
		if (this.mask) this.mask.dispose();
		return this;
	},

	adopt: function() {
		this.element.adopt.apply(this.element, arguments);
		return this;
	},

	grab: function(element) {
		this.element.grab(element);
	}

});