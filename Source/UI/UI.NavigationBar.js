/*
---

name: UI.NavigationBar

description: Provide the navigation bar control that contains a title and two
             areas for buttons.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control
	- UI.NavigationBarStyle

provides:
	- UI.NavigationBar

...
*/

UI.NavigationBar = new Class({

	Extends: UI.Control,

	wrapper: null,

	content: null,

	leftButton: null,

	rightButton: null,

	options: {
		className: 'ui-navigation-bar',
		styleName: UI.NavigationBarStyle.NORMAL
	},

	setup: function() {
		this.injectContent();
		this.injectWrapper();
		return this.parent()
	},

	destroy: function() {
		this.destroyContent();
		this.destroyWrapper();
		return this.parent();
	},

	injectWrapper: function() {
		this.wrapper = new Element('div.' + this.options.className + '-wrapper').adopt(this.element.getContents());
		this.element.empty();
		this.element.adopt(this.wrapper);
		return this;
	},

	destroyWrapper: function() {
		this.wrapper.destroy();
		this.wrapper = null;
		return this;
	},

	injectContent: function() {
		this.content = new Element('div.' + this.options.className + '-content').adopt(this.element.getContents());
		this.element.empty();
		this.element.adopt(this.content);
		return this;
	},

	destroyContent: function() {
		this.content.destroy();
		this.content = null;
		return this;
	},

	setTitle: function(title) {
		this.content.set('html', title);
		return this;
	},

	getTitle: function() {
		return this.content.get('html');
	},

	setLeftButton: function(button) {
		this.removeLeftButton();
		this.leftButton = button;
		this.leftButton.addClass(this.options.className + '-left');
		this.leftButton.inject(this.wrapper);
		return this;
	},

	setRightButton: function(button) {
		this.removeRightButton();
		this.rightButton = button;
		this.rightButton.addClass(this.options.className + '-right');
		this.rightButton.inject(this.wrapper);
		return this;
	},

	removeLeftButton: function() {
		if (this.leftButton) {
			this.leftButton.destroy();
			this.leftButton = null;
		}
		return this;
	},

	removeRightButton: function() {
		if (this.rightButton) {
			this.rightButton.destroy();
			this.rightButton = null;
		}
		return this;
	},

	show: function() {
		this.view.addClass(this.options.className + '-visible');
		this.parent();
		return this;
	},

	hide: function() {
		this.view.removeClass(this.options.className + '-visible');
		this.parent();
		return this;
	}

});