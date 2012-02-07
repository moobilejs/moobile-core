/*
---

name: Alert

description: Provides a control that displays a modal alert message.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Alert

...
*/

/**
 * @name  Alert
 * @class Provides a modal alert control.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends Overlay
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Alert = new Class( /** @lends Alert.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The title.
	 * @type   Text
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	title: null,

	/**
	 * The message.
	 * @type   Text
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	message: null,

	/**
	 * The buttons.
	 * @type   Array
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	buttons: [],

	/**
	 * The dialog element.
	 * @type   Element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	dialog: null,

	/**
	 * The dialog header element.
	 * @type   Element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	dialogHeader: null,

	/**
	 * The dialog footer element.
	 * @type   Element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	dialogFooter: null,

	/**
	 * The dialog content element.
	 * @type   Element
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	dialogContent: null,

	/**
	 * The alert overlay.
	 * @type   Overlay
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	overlay: null,

	/**
	 * Sets the title.
	 *
	 * This method will set the title using either a string or an instance of a
	 * `Label`. When provided with a string, this methods creates a `Label`
	 * instance and assign the given string as its text.
	 *
	 * @param {Mixed} title The title as a string or a `Label` instance.
	 *
	 * @return {Alert} This alert.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		if (this.title === title)
			return this;

		if (typeof title == 'string') {
			var text = title;
			title = new Moobile.Text();
			title.setText(text);
		}

		if (this.title == null) {
			this.title = title;
			this.addChild(title, 'top', this.dialogHeader);
		} else {
			this.replaceChild(this.title, title);
			this.title.destroy();
			this.title = title;
		}

		this.title.addClass('title');

		return this;
	},

	/**
	 * Returns the title.
	 *
	 * @return {Text} The title.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this.title;
	},

	/**
	 * Sets the message.
	 *
	 * This method will set the message using either a string or an instance of
	 * a `Text`. When provided with a string, this methods creates a `Text`
	 * instance and assign the given string as its text.
	 *
	 * @param {Mixed} message The message as string or a `Text` instance.
	 *
	 * @return {Alert} This alert.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setMessage: function(message) {

		if (this.message === message)
			return this;

		if (typeof message == 'string') {
			var text = message;
			message = new Moobile.Text();
			message.setText(text);
		}

		if (this.message == null) {
			this.message = message;
			this.addChild(message, 'top', this.dialogContent);
		} else {
			this.replaceChild(this.message, message);
			this.message.destroy();
			this.message = message;
		}

		this.message.addClass('message');

		return this;
	},

	/**
	 * Returns the message.
	 *
	 * @return {Text} The message.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getMessage: function() {
		return this.message;
	},

	/**
	 * Adds a button.
	 *
	 * This method will add the given button at the bottom of the element that
	 * contains buttons. The presentation of the buttons, either vertical or
	 * horizontal is defined by setting the proper style to this alert.
	 *
	 * @param {Button} button The button.
	 *
	 * @return {Alert} This alert.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButton: function(button) {
		this.addChild(button, 'bottom', this.dialogFooter);
		return this;
	},

	/**
	 * Shows the overlay with an animation.
	 *
	 * This method will show the overlay by adding the `show-animated` CSS
	 * class to the element. Update the properties of this CSS class to
	 * customize the animation.
	 *
	 * @return {Overlay} This overlay.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	showAnimated: function() {
		this.willShow();
		this.element.show();
		this.element.addClass('show-animated');
		this.overlay.showAnimated();
		return this;
	},

	/**
	 * Hides the overlay with an animation.
	 *
	 * This method will hide the overlay by adding the `hide-animated` CSS
	 * class to the element. Update the properties of this CSS class to
	 * customize the animation.
	 *
	 * @return {Overlay} This overlay.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hideAnimated: function() {
		this.willHide();
		this.element.addClass('hide-animated');
		this.overlay.hideAnimated();
		return this;
	},

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
	},

	didAddChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.addEvent('tap', this.bound('onButtonTap'));
			this.buttons.include(entity);
		}
	},

	didRemoveChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.removeEvent('tap', this.bound('onButtonTap'));
			this.buttons.erase(entity);
		}
	},

	willShow: function() {

		this.parent();

		if (this.buttons.length == 0) {
			var button = new Moobile.Button();
			button.setLabel('OK');
			this.addButton(button);
		}
	},

	didHide: function() {
		this.parent();
		this.destroy();
	},

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

	onButtonTap: function(e, sender) {

		var index = this.getChildren(Moobile.Button).indexOf(e.targetEntity);
		if (index >= 0) {
			this.fireEvent('select', [sender, index]);
		}

		this.hideAnimated();
	},

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

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('horizontal', Moobile.Alert, {
	attach: function() { this.element.addClass('style-horizontal'); },
	detach: function() { this.element.removeClass('style-horizontal'); }
});
