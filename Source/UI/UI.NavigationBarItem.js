/*
---

name: UI.NavigationBarItem

description: Provides a container with a title and two buttons for the
             navigation bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- UI.Control

provides:
	- UI.NavigationBarItem

...
*/

if (!window.Moobile.UI.Bar) window.Moobile.UI.Bar = {};

Moobile.UI.NavigationBarItem = new Class({

	Extends: Moobile.UI.Control,

	title: null,

	titleContainer: null,

	leftBarButton: null,

	leftBarButtonContainer: null,

	rightBarButton: null,

	rightBarButtonContainer: null,

	options: {
		className: 'ui-navigation-bar-item'
	},

	build: function() {
		this.parent();
		this.buildTitleContainer();
		this.buildLeftBarButtonContainer();
		this.buildRightBarButtonContainer();
		return this;
	},

	buildTitleContainer: function() {
		this.titleContainer = new Element('div.' + this.options.className + '-title');
		this.titleContainer.inject(this.content);
		return this;
	},

	buildLeftBarButtonContainer: function() {
		this.leftBarButtonContainer = new Element('div.' + this.options.className + '-left');
		this.leftBarButtonContainer.inject(this.titleContainer, 'before') ;
		return this;
	},

	buildRightBarButtonContainer: function() {
		this.rightBarButtonContainer = new Element('div.' + this.options.className + '-right');
		this.rightBarButtonContainer.inject(this.titleContainer, 'after');
		return this;
	},

	release: function() {
		this.title = null;
		this.titleContainer = null;
		this.leftBarButton = null;
		this.leftBarButtonContainer = null;
		this.rightBarButton = null;
		this.rightBarButtonContainer = null;
		this.parent();
		return this;
	},

	setLeftBarButton: function(button) {
		this.removeLeftBarButton();
		this.leftBarButton = button;
		this.leftBarButton.inject(this.leftBarButtonContainer);
		return this;
	},

	getLeftBarButton: function(button) {
		return this.leftBarButton;
	},

	removeLeftBarButton: function() {
		if (this.leftBarButton) {
			this.leftBarButton.destroy();
			this.leftBarButton = null;
		}
		return this;
	},

	setRightBarButton: function(button) {
		this.removeRightBarButton();
		this.rightBarButton = button;
		this.rightBarButton.inject(this.rightBarButtonContainer);
		return this;
	},

	getRightBarButton: function() {
		return this.rightBarButton;
	},

	removeRightBarButton: function() {
		if (this.rightBarButton) {
			this.rightBarButton.destroy();
			this.rightBarButton = null;
		}
		return this;
	},

	setTitle: function(title) {

		this.title = title;

		if (typeof this.title == 'string') {
			this.titleContainer.set('html', this.title);
			return this;
		}

		if (typeof this.title == 'object') {
			this.titleContainer.adopt(this.title);
			return this;
		}

		return this;
	},

	getTitle: function() {
		return this.title;
	}

});