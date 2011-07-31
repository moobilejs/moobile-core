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

	inputEnabled: true,

	userInputMask: null,

	options: {
		className: 'window'
	},

	filterChildView: function(element) {
		return element.getParent('[data-role=view]') == null;
	},

	getOrientation: function() {
		var o = Math.abs(window.orientation);
		switch (o) {
			case  0: return 'portrait';
			case 90: return 'landscape';
		}
	},

	enableInput: function() {
		if (this.inputEnabled == false) {
			this.inputEnabled = true;
			this.hideMask();
		}
		return this;
	},

	disableInput: function() {
		if (this.inputEnabled == true) {
			this.inputEnabled = false;
			this.showMask();
		}
	},

	isinputEnabled: function() {
		return this.inputEnabled;
	},

	showMask: function() {
		this.userInputMask = new Element('div.' + this.options.className + '-mask');
		this.userInputMask.inject(this.element);
		return this;
	},

	hideMask: function() {
		this.userInputMask.destroy();
		this.userInputMask = null;
		return this;
	},

	didAddChildView: function(view) {
		view.window = this;
		view.parentView = null;
		this.parent(view);
		return this;
	}

});