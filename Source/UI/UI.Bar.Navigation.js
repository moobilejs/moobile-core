/*
---

name: UI.Bar.Navigation

description: Provide the navigation bar control that contains a title and two
             areas for buttons.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Bar

provides:
	- UI.Bar.Navigation

...
*/

Moobile.UI.Bar.Navigation = new Class({

	Extends: Moobile.UI.Bar,

	leftButton: null,

	rightButton: null,

	options: {
		className: 'ui-navigation-bar'
	},

	release: function() {
		this.leftButton = null;
		this.rightButton = null;
		this.parent();
		return this;
	},

	setLeftButton: function(button) {
		this.removeLeftButton();
		this.leftButton = button;
		this.leftButton.addClass(this.options.className + '-left');
		this.leftButton.inject(this.contentElement);
		return this;
	},

	getLeftButton: function(button) {
		return this.leftButton;
	},

	removeLeftButton: function() {
		if (this.leftButton) {
			this.leftButton.destroy();
			this.leftButton = null;
		}
		return this;
	},

	setRightButton: function(button) {
		this.removeRightButton();
		this.rightButton = button;
		this.rightButton.addClass(this.options.className + '-right');
		this.rightButton.inject(this.contentElement);
		return this;
	},

	getRightButton: function() {
		return this.rightButton;
	},

	removeRightButton: function() {
		if (this.rightButton) {
			this.rightButton.destroy();
			this.rightButton = null;
		}
		return this;
	}

});