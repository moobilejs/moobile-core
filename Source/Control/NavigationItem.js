/*
---

name: NavigationItem

description: Provides a container with a title and two buttons for the
             navigation bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- NavigationItem

...
*/

Moobile.NavigationItem = new Class({

	Extends: Moobile.Control,

	label: null,

	leftBarButton: null,

	leftBarButtonVisible: true,

	rightBartButton: null,

	rightBarButtonVisible: true,

	options: {
		className: 'navigation-item'
	},

	build: function(element) {

		this.parent(element);

		var lBarButton = this.getElement('[data-role=left-bar-button]');
		var rBarButton = this.getElement('[data-role=right-bar-button]');

		var label = this.getElement('[data-role=label]');
		if (label == null) {
			label = new Element('div[data-role=label]');
			label.ingest(this.content);
			label.inject(this.content);
		}

		this.label = this.getRoleInstance(label);

		if (lBarButton) {
			lBarButton.inject(this.content);
			lBarButton = this.getRoleInstance(lBarButton);
			this.setLeftBarButton(lBarButton);
		}

		if (rBarButton) {
			rBarButton.inject(this.content);
			rBarButton = this.getRoleInstance(rBarButton);
			this.setRightBarButton(rBarButton);
		}

		return this;
	},

	setLabel: function(label) {

		if (this.label == label)
			return this;

		this.label.setText(null);
		this.label.hide();

		if (label) {

			var type = typeOf(label);
			if (type == 'string') {
				this.label.setText(label);
				this.label.show();
				return this;
			}

			if (type == 'element') {
				label = new Moobile.Label(label);
			}

			this.replaceChildView(this.label, label);
			this.label.destroy();
			this.label = label;
		}

		return this;
	},

	getLabel: function() {
		return this.label;
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

			if (this.options.className) {
				this.leftBarButton.addClass(this.options.className + '-left-button');
			}

			this.addChildView(this.leftBarButton, 'before', this.label);

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

			if (this.options.className) {
				this.rightBarButton.addClass(this.options.className + '-right-button');
			}

			this.addChildView(this.rightBarButton, 'before', this.label);

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

	release: function() {
		this.label = null;
		this.leftBarButton = null;
		this.rightBarButton = null;
		this.parent();
		return this;
	}

});