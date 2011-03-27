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

	view: null,

	wrapper: null,

	caption: null,

	buttons: null,

	options: {
		className: 'ui-navigation-bar',
		styleName: UI.NavigationBarStyle.NORMAL
	},

	setup: function() {
		this.parent();
		this.injectCaption();
		return this;
	},

	destroy: function() {
		this.hide();
		this.destroyCaption();
		return this.parent();
	},

	injectCaption: function() {
		this.caption = new Element('div.' + this.options.className + '-caption').set('html', this.element.get('html'));
		this.element.empty();
		this.element.adopt(this.caption);
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

	setButton: function(button, where) {
		var element = this.element.getElement('div.' + this.options.className + '-button-' + where);
		if (element) {
			element.dispose();
			element = null;
		}
		if (button) {
			element = new Element('div.' + this.options.className + '-button-' + where);
			element.adopt(button);
			this.element.adopt(element);
		}
		return this;
	},

	setView: function(view) {
		this.view = view;
		return this;
	},

	getView: function() {
		return this.view;
	},

	show: function() {
		this.parent();
		this.view.addClass(this.options.className + '-visible');
		return this;
	},

	hide: function() {
		this.parent();
		this.view.removeClass(this.options.className + '-visible');
		return this;
	}

});