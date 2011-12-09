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

	Extends: Moobile.Overlay,

	/**
	 * @var    {Entity} This alert's title.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	title: null,

	/**
	 * @var    {Entity} This alert's message.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	message: null,

	/**
	 * @var    {Element} This alert's dialog container element.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	dialog: null,

	/**
	 * @var    {Element} This alert's dialog header element.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	dialogHeader: null,

	/**
	 * @var    {Element} This alert's dialog footer element.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	dialogFooter: null,

	/**
	 * @var    {Element} This alert's dialog content element.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	dialogContent: null,

	/**
	 * @var    {Array} This alert's buttons.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	buttons: [],

	/**
	 * Sets this alert's title.
	 *
	 * This method will set the title using either a string or an instance of a
	 * Label. When provided with a string, this methods instantiate a new Label
	 * and assign the given string as its text.
	 *
	 * @param {Mixed} title The title as either a string or Label.
	 *
	 * @return {Alert} This alert.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		// TODO : Should work the same as the button label.

		if (this.title === title)
			return this;

		if (this.title instanceof Moobile.Entity) {
			this.title.removeFromOwner();
			this.title.destroy();
			this.title = null;
		}

		this.dialogHeader.empty();

		if (title instanceof Moobile.Entity) {
			this.addChild(title, 'bottom', this.dialogHeader);
		} else {
			this.dialogHeader.set('html', title);
		}

		this.title = title;

		return this;
	},

	/**
	 * Return this alert's title.
	 *
	 * This method will always return a Label object even though the title may
	 * have been set using a string.
	 *
	 * @return {Label} The title.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this.title;
	},

	/**
	 * Sets this alert's message.
	 *
	 * This method will set the title using either a string or an instance of a
	 * Text. When provided with a string, this methods instantiate a new Text
	 * and assign the given string as its text.
	 *
	 * @param {Mixed} message The message as either a string or a Text.
	 *
	 * @return {Alert} This alert.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setMessage: function(message) {

		// TODO : Should work the same as the button label.

		if (this.message === message)
			return this;

		if (this.message instanceof Moobile.Entity) {
			this.message.removeFromOwner();
			this.message.destroy();
			this.message = null;
		}

		this.dialogContent.empty();

		if (message instanceof Moobile.Entity) {
			this.addChild(message, 'bottom', this.dialogContent);
		} else {
			this.dialogContent.set('html', message);
		}

		this.message = message;

		return this;
	},

	/**
	 * Returns the message.
	 *
	 * This method will always return a Text object even though the message may
	 * have been set using a string.
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

	destroy: function() {

		this.title = null;
		this.message = null;
		this.buttons = null;

		this.dialog = null;
		this.dialogHeader = null;
		this.dialogFooter = null;
		this.dialogContent = null;

		this.parent();
	},

	didLoad: function() {

		this.parent();

		this.element.addClass('alert');

		this.dialogHeader  = new Element('div.dialog-dialogHeader');
		this.dialogFooter  = new Element('div.dialog-dialogFooter');
		this.dialogContent = new Element('div.dialog-dialogContent');

		this.dialog = new Element('div.dialog');
		this.dialog.grab(this.dialogHeader);
		this.dialog.grab(this.dialogContent);
		this.dialog.grab(this.dialogFooter);

		this.element.grab(this.dialog);
	},

	didAddChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.addEvent('click', this.bound('onButtonClick'));
			entity.addEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.addEvent('mousedown', this.bound('onButtonMouseUp'));
			this.buttons.include(entity);
		}
	},

	didRemoveChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.removeEvent('click', this.bound('onButtonClick'));
			entity.removeEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.removeEvent('mousedown', this.bound('onButtonMouseUp'));
			this.button.erase(entity);
		}
	},

	willShow: function() {

		this.parent();

		if (this.buttons.length == 0) {
			var button = new Moobile.Button();
			button.setLabel('OK');
			button.setHighlighted(true);
			this.addButton(button);
		}
	},

	onButtonClick: function(e) {

		this.fireEvent('buttonclick', e.target);

		if (this.buttons.length == 1) {
			this.hideAnimated();
		}
	},

	onButtonMouseUp: function() {
		this.fireEvent('buttonmouseup');
	},

	onButtonMouseDown: function() {
		this.fireEvent('buttonmousedown');
	}

});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('horizontal', Moobile.Alert, {
	attach: function() { this.element.addClass('style-horizontal'); },
	detach: function() { this.element.removeClass('style-horizontal'); }
});
