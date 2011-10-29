/*
---

name: NavigationBar

description: Provides a NavigationBar control. 

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar
	- NavigationBarRoles

provides:
	- NavigationBar

...
*/

Moobile.NavigationBar = new Class({

	Extends: Moobile.Bar,

	Roles: Moobile.NavigationBarRoles,

	title: null,

	leftBarButton: null,

	leftBarButtonVisible: true,

	rightBarButton: null,

	rightBarButtonVisible: true,

	build: function() {

		this.parent();

		var lBarButton = this.getRolePerformer('bar-button-left');
		var rBarButton = this.getRolePerformer('bar-button-right');

		var title = this.getRolePerformer('bar-title');
		if (title == null) {
			title = new Element('div');
			title.ingest(this.content);
			title.inject(this.content);
		}

		this.title = this.applyRole(title, 'bar-title');

		if (lBarButton) {
			lBarButton.inject(this.content, 'top');
			lBarButton = this.applyRole(lBarButton, 'bar-button-left');
			this.setLeftBarButton(lBarButton);
		}

		if (rBarButton) {
			rBarButton.inject(this.content);
			rBarButton = this.applyRole(rBarButton, 'bar-button-right');
			this.setRightBarButton(rBarButton);
		}

		if (this.options.className) {
			this.element.addClass('navigation-' + this.options.className);
		}

		return this;
	},

	setTitle: function(title) {

		if (this.title == title)
			return this;

		this.title.setText(null);
		this.title.hide();

		if (title) {

			var type = typeOf(title);
			if (type == 'string') {
				this.title.setText(title);
				this.title.show();
				return this;
			}

			if (type == 'element') {
				title = new Moobile.BarTitle(title);
			}

			this.replaceChildView(this.title, title);
			this.title.destroy();
			this.title = title;
		}

		return this;
	},

	getTitle: function() {
		return this.title;
	},

	setLeftBarButton: function(leftBarButton) {

		if (this.leftBarButton == leftBarButton)
			return this;

		if (this.leftBarButton) {
			this.leftBarButton.removeFromParent();
			this.leftBarButton.destroy();
			this.leftBarButton = null;
		}

		if (leftBarButton) {

			var type = typeOf(leftBarButton);
			if (type == 'string') {
				this.leftBarButton = new Moobile.Button();
				this.leftBarButton.setLabel(leftBarButton);
			} else if (type == 'element') {
				this.leftBarButton = new Moobile.Button(leftBarButton);
			}

			this.leftBarButton = leftBarButton;
			this.leftBarButton.set('data-task', 'left');

			this.addChild(this.leftBarButton, 'before', this.title);

			if (this.leftBarButtonVisible == false) {
				this.leftBarButton.hide();
			}
		}

		return this;
	},

	getLeftBarButton: function() {
		return this.leftBarButton;
	},

	setLeftBarButtonVisible: function(visible) {
		this.leftBarButtonVisible = visible;
		if (this.leftBarButton) {
			this.leftBarButton[visible ? 'show' : 'hide'].call(this.leftBarButton);
		}
		return this;
	},

	isLeftButtonVisible: function() {
		return this.leftBarButtonVisible;
	},

	setRightBarButton: function(rightButton) {

		if (this.rightButton == rightButton)
			return this;

		if (this.rightButton) {
			this.rightButton.removeFromParent();
			this.rightButton.destroy();
			this.rightButton = null;
		}

		if (rightButton) {

			var type = typeOf(rightButton);
			if (type == 'string') {
				this.rightButton = new Moobile.Button();
				this.rightButton.setLabel(rightButton);
			} else if (type == 'element') {
				this.rightButton = new Moobile.Button(rightButton);
			}

			this.rightButton = rightButton;
			this.rightButton.set('data-task', 'right');

			this.addChild(this.rightButton, 'before', this.title);

			if (this.rightBarButtonVisible == false) {
				this.rightButton.hide();
			}
		}

		return this;
	},

	getRightBarButton: function() {
		return this.rightButton;
	},

	setRightBarButtonVisible: function(visible) {
		this.rightBarButtonVisible = visible;
		if (this.rightButton) {
			this.rightButton[visible ? 'show' : 'hide'].call(this.rightButton);
		}
		return this;
	},

	isRightButtonVisible: function() {
		return this.rightBarButtonVisible;
	},

	teardown: function() {
		this.title = null;
		this.leftBarButton = null;
		this.rightButton = null;
		this.parent();
		return this;
	}

});