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

	leftElement: null,

	rightElement: null,

	leftButton: null,

	rightButton: null,

	options: {
		className: 'ui-navigation-bar'
	},

	build: function() {
		this.parent();
		this.buildLeftElement();
		this.buildRightElement();
		return this;
	},

	buildLeftElement: function() {
		this.leftElement = new Element('div.' + this.options.className + '-left');
		this.leftElement.inject(this.captionElement, 'before');
		return this;
	},

	buildRightElement: function() {
		this.rightElement = new Element('div.' + this.options.className + '-right');
		this.rightElement.inject(this.captionElement, 'after');
		return this;
	},

	release: function() {
		this.leftButton = null;
		this.leftElement = null;
		this.rightButton = null;
		this.rightElement = null;
		this.parent();
		return this;
	},

	setLeftButton: function(button) {
		this.removeLeftButton();
		this.leftButton = button;
		this.leftButton.inject(this.leftElement);
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
		this.rightButton.inject(this.rightElement);
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
	},

	viewWillChange: function(view) {
		if (this.view) this.view.removeClass('with-' + this.options.className);
		this.parent();
		return this;
	},

	viewDidChange: function(view) {
		if (this.view) this.view.addClass('with-' + this.options.className);
		this.parent();
		return this;
	}

});