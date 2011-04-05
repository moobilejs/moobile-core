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

	Static: {
		PORTRAIT: 2,
		LANDSCAPE: 3
	},

	Extends: Moobile.View,

	viewController: null,

	userInputEnabled: true,

	userInputMask: null,

	options: {
		className: 'window'
	},

	setup: function() {
		this.options.wrapper = false;
		this.options.content = false;
		this.position();
		return this.parent();
	},

	attachEvents: function() {
		document.body.addEvent(Event.ORIENTATION_CHANGE, this.bound('onOrientationChange'));
		return this.parent();
	},

	detachEvents: function() {
		document.body.removeEvent(Event.ORIENTATION_CHANGE, this.bound('onOrientationChange'));
		return this;
	},

	setViewController: function(viewController) {
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

	getOrientation: function() {
		var o = Math.abs(window.orientation);
		switch (o) {
			case  0: return Moobile.Window.PORTRAIT;
			case 90: return Moobile.Window.LANDSCAPE;
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

	position: function() {
		var fn = function() { window.scrollTo(0, 1) };
		fn.delay(50);
		return this;
	},

	onOrientationChange: function(e) {
		this.viewController.orientationDidChange(this.getOrientation());
		this.position();
		return this;
	}

});