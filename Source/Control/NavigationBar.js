/*
---

name: NavigationBar

description: Provides a NavigationBar control. 

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar

provides:
	- NavigationBar

...
*/

Moobile.NavigationBar = new Class({

	Extends: Moobile.Bar,

	title: null,

	leftBarButton: null,

	leftBarButtonVisible: true,

	rightBartButton: null,

	rightBarButtonVisible: true,

	build: function(element) {

		this.parent(element);

		var lBarButton = this.getElement('[data-role=bar-button][data-task=left]');
		var rBarButton = this.getElement('[data-role=bar-button][data-task=right]');

		var title = this.getElement('[data-role=bar-title]');
		if (title == null) {
			title = new Element('div');
			title.ingest(this.content);
			title.inject(this.content);
		}

		this.title = this.getRoleInstance(title);

		if (lBarButton) {
			lBarButton.inject(this.content, 'top');
			lBarButton = this.getRoleInstance(lBarButton);
			this.setLeftBarButton(lBarButton);
		}

		if (rBarButton) {
			rBarButton.inject(this.content);
			rBarButton = this.getRoleInstance(rBarButton);
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
			this.leftBarButton.removeFromParentView();
			this.leftBarButton.destroy();
			this.leftBarButton = null;
		}

		if (leftBarButton) {

			var type = typeOf(leftBarButton);
			if (type == 'string') {
				this.leftBarButton = new Moobile.BarButton();
				this.leftBarButton.setLabel(leftBarButton);
			} else if (type == 'element') {
				this.leftBarButton = new Moobile.BarButton(leftBarButton);
			}

			this.leftBarButton = leftBarButton;
			this.leftBarButton.set('data-task', 'left');

			this.addChildView(this.leftBarButton, 'before', this.title);

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

	isLeftBarButtonVisible: function() {
		return this.leftBarButtonVisible;
	},

	setRightBarButton: function(rightBarButton) {

		if (this.rightBarButton == rightBarButton)
			return this;

		if (this.rightBarButton) {
			this.rightBarButton.removeFromParentView();
			this.rightBarButton.destroy();
			this.rightBarButton = null;
		}

		if (rightBarButton) {

			var type = typeOf(rightBarButton);
			if (type == 'string') {
				this.rightBarButton = new Moobile.BarButton();
				this.rightBarButton.setLabel(rightBarButton);
			} else if (type == 'element') {
				this.rightBarButton = new Moobile.BarButton(rightBarButton);
			}

			this.rightBarButton = rightBarButton;
			this.rightBarButton.set('data-task', 'right');

			this.addChildView(this.rightBarButton, 'before', this.title);

			if (this.rightBarButtonVisible == false) {
				this.rightBarButton.hide();
			}
		}

		return this;
	},

	getRightBarButton: function() {
		return this.rightBarButton;
	},

	setRightBarButtonVisible: function(visible) {
		this.rightBarButtonVisible = visible;
		if (this.rightBarButton) {
			this.rightBarButton[visible ? 'show' : 'hide'].call(this.rightBarButton);
		}
		return this;
	},

	isRightBarButtonVisible: function() {
		return this.rightBarButtonVisible;
	},

	teardown: function() {
		this.title = null;
		this.leftBarButton = null;
		this.rightBarButton = null;
		this.parent();
		return this;
	}

});