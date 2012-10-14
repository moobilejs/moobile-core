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
 * @see    http://moobilejs.com/doc/latest/Dialog/Alert
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Alert = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_title: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_message: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_buttons: [],

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#boxElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	boxElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#contentElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#headerElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	headerElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#footerElement
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	footerElement: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#overlay
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	overlay: null,

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#options
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		layout: null
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('alert');
		this.element.addEvent('animationend', this.bound('_onAnimationEnd'));

		this.overlay = new Moobile.Overlay();
		this.overlay.setStyle('radial');
		this.addChildComponent(this.overlay);

		this.headerElement = document.createElement('div');
		this.headerElement.addClass('alert-header');

		this.footerElement = document.createElement('div');
		this.footerElement.addClass('alert-footer');

		this.contentElement = document.createElement('div');
		this.contentElement.addClass('alert-content');

		this.boxElement = document.createElement('div');
		this.boxElement.addClass('alert-box');
		this.boxElement.grab(this.headerElement);
		this.boxElement.grab(this.contentElement);
		this.boxElement.grab(this.footerElement);

		this.element.grab(this.boxElement);

		var layout = this.options.layout;
		if (layout) {
			this.element.addClass('alert-layout-' + layout);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		this.element.addEvent('animationend', this.bound('_onAnimationEnd'));

		this._title = null;
		this._message = null;

		this.boxElement = null;
		this.headerElement = null;
		this.footerElement = null;
		this.contentElement = null;

		this.overlay.destroy();
		this.overlay = null;

		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		title = title || '';
		if (typeof title === 'string') {
			title = new Moobile.Text().setText(title);
		}

		if (this._title) {
			this._title.replaceWithComponent(title, true);
		} else {
			this.addChildComponentInside(title, this.headerElement);
		}

		this._title = title;
		this._title.addClass('alert-title');

		this.element.toggleClass('no-alert-title', this._title.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#setMessage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setMessage: function(message) {

		if (this._message === message)
			return this;

		message = message || '';
		if (typeof message === 'string') {
			message = new Moobile.Text().setText(message);
		}

		if (this._message) {
			this._message.replaceWithComponent(message, true);
		} else {
			this.addChildComponentInside(message, this.contentElement);
		}

		this._message = message;
		this._message.addClass('alert-message');

		this.element.toggleClass('no-alert-message', this._message.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getMessage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getMessage: function() {
		return this._message;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButton: function(button) {
		return this.addChildComponentInside(Moobile.Button.from(button), this.footerElement);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#addButtonAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonAfter: function(button, after) {
		return this.addChildComponentAfter(Moobile.Button.from(button), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ButtonGroup#addButtonBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonBefore: function(button, before) {
		return this.addChildComponentBefore(Moobile.Button.from(button), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButton: function(name) {
		return this.getChildComponentOfType(Moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButtons: function() {
		return this.getChildComponentsOfType(Moobile.Button);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButtonAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	removeButton: function(button) {
		return this.removeChildComponent(button);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	removeAllButton: function() {
		return this.removeAllChildComponentsOfType(Moobile.Button);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#setDefaultButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setDefaultButton: function(button) {
		if (this.hasChildComponent(button)) button.addClass('is-default');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#setDefaultButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setDefaultButtonIndex: function(index) {
		return this.setDefaultButton(this.getChildComponentOfTypeAt(Moobile.Button, index));
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#showAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	showAnimated: function() {
		this.willShow();
		this.element.addClass('show-animated');
		this.element.show();
		this.overlay.showAnimated();
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#hideAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	hideAnimated: function() {
		this.willHide();
		this.element.addClass('hide-animated');
		this.overlay.hideAnimated();
		return this;
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didAddChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Moobile.Button) {
			child.addEvent('tap', this.bound('_onButtonTap'));
			this._buttons.include(child);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Moobile.Button) {
			child.removeEvent('tap', this.bound('_onButtonTap'));
			this._buttons.erase(child);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willShow: function() {

		this.parent();

		if (this.getParentView() === null) {
			var instance = Moobile.Window.getCurrentInstance();
			if (instance) {
				instance.addChildComponent(this);
			}
		}

		if (this._buttons.length === 0) {
			var button = new Moobile.Button();
			button.setLabel('OK');
			this.addButton(button);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didHide: function() {
		this.parent();
		this.removeFromParentComponent();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onButtonTap: function(e, sender) {

		var index = this.getChildComponentsOfType(Moobile.Button).indexOf(sender);
		if (index >= 0) {
			this.fireEvent('dismiss', [sender, index]);
		}

		this.hideAnimated();
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onAnimationEnd: function(e) {

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
