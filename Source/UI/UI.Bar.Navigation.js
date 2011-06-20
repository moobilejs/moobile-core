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

	caption: null,

	leftButton: null,

	rightButton: null,

	options: {
		className: 'ui-navigation-bar'
	},

	setup: function() {
		this.parent();
		this.injectCaption();
		return this;
	},

	teardown: function() {
		this.destroyCaption();
		this.parent();
		return this;
	},

	injectCaption: function() {
		this.caption = new Element('div.' + this.options.className + '-caption').adopt(this.content.getContents());
		this.content.empty();
		this.content.adopt(this.caption);
		return this;
	},

	destroyCaption: function() {
		this.caption.destroy();
		this.caption = null;
		return this;
	},

	setTitle: function(title) {
		this.caption.set('html', title);
		return this;
	},

	getTitle: function() {
		return this.caption.get('html');
	},

	setLeftButton: function(button) {
		this.removeLeftButton();
		this.leftButton = button;
		this.leftButton.addClass(this.options.className + '-left');
		this.leftButton.inject(this.content);
		return this;
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
		this.rightButton.inject(this.content);
		return this;
	},

	removeRightButton: function() {
		if (this.rightButton) {
			this.rightButton.destroy();
			this.rightButton = null;
		}
		return this;
	}

});