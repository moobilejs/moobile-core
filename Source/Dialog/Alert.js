/*
---

name: Alert

description: Provide an alert message box.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control
	- AlertStyle

provides:
	- Alert

...
*/

Moobile.Alert = new Class({

	Extends: Moobile.View,

	options: {
		className: 'alert',
		buttonLabel: 'OK',
		buttonLayout: 'vertical'
	},

	mask: null,

	header: null,

	footer: null,

	buttons: [],

	build: function(element) {

		this.parent(element);

		this.set('role', 'dialog');

		this.header = new Element('div');
		this.header.inject(this.element, 'top');

		this.footer = new Element('div');
		this.footer.inject(this.element, 'bottom');

		if (this.options.className) {
			this.header.addClass(this.options.className + '-header');
			this.footer.addClass(this.options.className + '-footer');
			this.element.addClass(this.options.className + '-' + this.options.buttonLayout);
		}

		return this;
	},

	setTitle: function(title) {
		this.header.empty();
		this.header.set('html', title);
		return this;
	},

	setMessage: function(message) {
		this.content.empty();
		this.content.set('html', message);
		return this;
	},

	addButton: function(button) {
		button.addEvent('click', this.bound('onButtonClick'));
		this.addChildView(button, 'bottom', this.footer);
		this.buttons.push(button);
		return this;
	},

	present: function() {

		if (this.buttons.length == 0) {
			var dismissButton = new Moobile.Button();
			dismissButton.setLabel(this.options.buttonLabel);
			dismissButton.setHighlighted(true);
			this.addButton(dismissButton);
		}

		this.mask = new Moobile.Mask(null, {
			fillStyle: 'gradient'
		});

		Moobile.Window.getInstance().addChildView(this.mask);

		this.mask.addChildView(this);
		this.mask.show();

		this.element.addEvent('animationend:once', this.bound('onPresentAnimationComplete'));
		this.element.addClass('present');

		return this;
	},

	dismiss: function() {

		this.mask.hide();
		this.mask.addEvent('hide', this.bound('onMaskHide'));

		this.element.addEvent('animationend:once', this.bound('onDismissAnimationComplete'));
		this.element.addClass('dismiss');

		return this;
	},

	onPresentAnimationComplete: function() {
		this.fireEvent('present');
		return this;
	},

	onDismissAnimationComplete: function() {
		this.removeFromParentView();
		this.fireEvent('dismiss');
		return this;
	},

	onButtonClick: function(e) {

		this.fireEvent('buttonclick', e.target);

		if (this.buttons.length == 1) {
			this.dismiss();
		}

		return this;
	},

	onMaskHide: function() {
		this.removeFromParentView();
		this.mask.destroy();
		this.mask = null;
	}

});