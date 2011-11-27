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
 * Provides a control that displays a modal alert message.
 *
 * @name Alert
 * @class Alert
 * @extends Overlay
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Alert = new Class( /** @lends Alert.prototype */ {

	Extends: Moobile.Overlay,

	/**
	 * The title.
	 * @type {Entity}
	 */
	title: null,

	/**
	 * The message.
	 * @type {Entity}
	 */
	message: null,

	/**
	 * The dialog element.
	 * @type {Element}
	 */
	dialog: null,

	/**
	 * The dialog header element.
	 * @type {Element}
	 */
	header: null,

	/**
	 * The dialog footer element.
	 * @type {Element}
	 */
	footer: null,

	/**
	 * The dialog content element.
	 * @type {Element}
	 */
	content: null,

	/**
	 * The buttons.
	 * @type {Array}
	 */
	buttons: [],

	/**
	 * Set the title with either a string or an entity object.
	 * @param {Mixed} title The title as a string or an entity object.
	 * @returh {Alert}
	 * @since 0.1
	 */
	setTitle: function(title) {

		if (this.title === title)
			return this;

		if (this.title instanceof Moobile.Entity) {
			this.title.removeFromOwner();
			this.title.destroy();
			this.title = null;
		}

		this.header.empty();

		if (title instanceof Moobile.Entity) {
			this.addChild(title, 'bottom', this.header);
		} else {
			this.header.set('html', title);
		}

		this.title = title;

		return this;
	},

	/**
	 * Return the title entity.
	 * @return {Entity}
	 * @since 0.1
	 */
	getTitle: function() {
		return this.title;
	},

	/**
	 * Set the message with either a string or an entity object.
	 * @param {Mixed} message The message as a string or an entity object.
	 * @return {Alert}
	 * @since 0.1
	 */
	setMessage: function(message) {

		if (this.message === message)
			return this;

		if (this.message instanceof Moobile.Entity) {
			this.message.removeFromOwner();
			this.message.destroy();
			this.message = null;
		}

		this.content.empty();

		if (message instanceof Moobile.Entity) {
			this.addChild(message, 'bottom', this.content);
		} else {
			this.content.set('html', message);
		}

		this.message = message;

		return this;
	},

	/**
	 * Return the message entity.
	 * @return {Entity}
	 * @since 0.1
	 */
	getMessage: function() {
		return this.message;
	},

	/**
	 * Add a button to display at the bottom of the alert.
	 * @param {Button} button Button
	 * @return {Alert}
	 * @since 0.1
	 */
	addButton: function(button) {
		this.addChild(button, 'bottom', this.footer);
		return this;
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {

		this.parent();

		this.element.addClass('alert');

		this.header  = new Element('div.dialog-header');
		this.footer  = new Element('div.dialog-footer');
		this.content = new Element('div.dialog-content');

		this.dialog = new Element('div.dialog');
		this.dialog.grab(this.header);
		this.dialog.grab(this.content);
		this.dialog.grab(this.footer);

		this.element.grab(this.dialog);
	},

	/**
	 * @see Entity#didAddChild
	 */
	didAddChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.addEvent('click', this.bound('onButtonClick'));
			entity.addEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.addEvent('mousedown', this.bound('onButtonMouseUp'));
			this.buttons.include(entity);
		}
	},

	/**
	 * @see Entity#didRemoveChild
	 */
	didRemoveChild: function(entity) {

		this.parent(entity);

		if (entity instanceof Moobile.Button) {
			entity.removeEvent('click', this.bound('onButtonClick'));
			entity.removeEvent('mouseup', this.bound('onButtonMouseUp'));
			entity.removeEvent('mousedown', this.bound('onButtonMouseUp'));
			this.button.erase(entity);
		}
	},

	/**
	 * @see Entity#willShow
	 */
	willShow: function() {

		this.parent();

		if (this.buttons.length == 0) {

			var button = new Moobile.Button();
			button.setLabel('OK');
			button.setHighlighted(true);

			this.addButton(button);
		}
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {

		this.dialog = null;
		this.header = null;
		this.footer = null;
		this.content = null;
		this.buttons = null;
		this.message = null;
		this.title = null;

		this.parent();
	},

	/**
	 * Button click event hand.er
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onButtonClick: function(e) {

		this.fireEvent('buttonclick', e.target);

		if (this.buttons.length == 1) {
			this.hideAnimated();
		}
	},

	/**
	 * Button mouse up event handler.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
	onButtonMouseUp: function() {
		this.fireEvent('buttonmouseup');
	},

	/**
	 * Button mouse down event handler.
	 * @param {Event} e The event.
	 * @private
	 * @since 0.1
	 */
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
