/*
---

name: Alert

description: Provides a control that displays a modal alert message.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Component

provides:
	- Alert

...
*/

/**
 * @see    http://moobile.net/api/0.1/Dialog/Alert
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Alert = new Class( /** @lends Alert.prototype */ {

	Extends: Moobile.Component,

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	title: null,

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	message: null,

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	buttons: [],

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	dialog: null,

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	dialogHeader: null,

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	dialogFooter: null,

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	dialogContent: null,

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	overlay: null,

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		buttonLayout: 'vertical'
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('alert');
		this.element.addEvent('animationend', this.bound('onAnimationEnd'));

		this.overlay = new Moobile.Overlay();
		this.overlay.setStyle('radial');
		this.addChild(this.overlay);

		this.dialogHeader  = new Element('div.dialog-header');
		this.dialogFooter  = new Element('div.dialog-footer');
		this.dialogContent = new Element('div.dialog-content');

		this.dialog = new Element('div.dialog');
		this.dialog.grab(this.dialogHeader);
		this.dialog.grab(this.dialogContent);
		this.dialog.grab(this.dialogFooter);

		this.element.grab(this.dialog);

		var buttonLayout = this.options.buttonLayout;
		if (buttonLayout) {
			this.element.addClass('button-layout-' + buttonLayout);
		}
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		this.element.addEvent('animationend', this.bound('onAnimationEnd'));

		this.title = null;
		this.message = null;

		this.dialog = null;
		this.dialogHeader = null;
		this.dialogFooter = null;
		this.dialogContent = null;

		this.overlay.destroy();
		this.overlay = null;

		this.parent();
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setTitle: function(title) {

		if (this.title === title)
			return this;

		if (typeof title === 'string') {
			var text = title;
			title = new Moobile.Text();
			title.setText(text);
		}

		if (this.title === null) {
			this.title = title;
			this.addChild(title, 'top', this.dialogHeader);
		} else {
			this.replaceChild(this.title, title, true);
			this.title = title;
		}

		this.title.addClass('title');

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getTitle: function() {
		return this.title;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setMessage: function(message) {

		if (this.message === message)
			return this;

		if (typeof message === 'string') {
			var text = message;
			message = new Moobile.Text();
			message.setText(text);
		}

		if (this.message === null) {
			this.message = message;
			this.addChild(message, 'top', this.dialogContent);
		} else {
			this.replaceChild(this.message, message, true);
			this.message = message;
		}

		this.message.addClass('message');

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMessage: function() {
		return this.message;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addButton: function(button) {
		this.addChild(button, 'bottom', this.dialogFooter);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setDefaultButton: function(button) {
		if (this.hasChild(button)) button.addClass('default');
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setDefaultButtonIndex: function(index) {
		return this.setDefaultButton(this.getChildren(Moobile.Button)[index]);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	showAnimated: function() {
		this.willShow();
		this.element.show();
		this.element.addClass('show-animated');
		this.overlay.showAnimated();
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hideAnimated: function() {
		this.willHide();
		this.element.addClass('hide-animated');
		this.overlay.hideAnimated();
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChild: function(child) {

		this.parent(child);

		if (child instanceof Moobile.Button) {
			child.addEvent('tap', this.bound('onButtonTap'));
			this.buttons.include(child);
		}
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChild: function(child) {

		this.parent(child);

		if (child instanceof Moobile.Button) {
			child.removeEvent('tap', this.bound('onButtonTap'));
			this.buttons.erase(child);
		}
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willShow: function() {

		this.parent();

		if (this.buttons.length === 0) {
			var button = new Moobile.Button();
			button.setLabel('OK');
			this.addButton(button);
		}
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didHide: function() {
		this.parent();
		this.destroy();
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onButtonTap: function(e, sender) {

		var index = this.getChildren(Moobile.Button).indexOf(sender);
		if (index >= 0) {
			this.fireEvent('dismiss', [sender, index]);
		}

		this.hideAnimated();
	},

	/**
	 * @see    http://moobile.net/api/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	onAnimationEnd: function(e) {

		e.stop();

		if (this.element.hasClass('show-animated')) {
			this.element.removeClass('show-animated');
			this.didShow();
		}

		if (this.element.hasClass('hide-animated')) {
			this.element.removeClass('hide-animated');
			this.element.hide();
			this.didHide();
		}
	}

});
