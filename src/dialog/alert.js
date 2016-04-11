"use strict"

/**
 * @see    http://moobilejs.com/doc/latest/Dialog/Alert
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
var Alert = moobile.Alert = new Class({

	Extends: moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__title: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__message: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__buttons: [],

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
		layout: 'horizontal',
		title: null,
		message: null,
		buttons: null
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('alert');
		this.addEvent('animationend', this.bound('__onAnimationEnd'))

		this.overlay = new moobile.Overlay();
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
			this.addClass('alert-layout-' + layout);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didBuild: function() {

		this.parent();

		this.setTitle(this.options.title);
		this.setMessage(this.options.message);

		var buttons = this.options.buttons;
		if (buttons) {
			this.addButtons(buttons);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {

		this.removeEvent('animationend', this.bound('__onAnimationEnd'));

		this.__title = null;
		this.__message = null;

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

		if (this.__title !== null && this.__title === title)
			return this;

		title = moobile.Text.from(title);

		if (this.__title) {
			this.__title.replaceWithComponent(title, true);
		} else {
			this.addChildComponentInside(title, this.headerElement);
		}

		this.__title = title;
		this.__title.addClass('alert-title');
		this.toggleClass('alert-title-empty', this.__title.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this.__title;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#setMessage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setMessage: function(message) {

		if (this.__message !== null && this.__message === message)
			return this;

		message = moobile.Text.from(message);

		if (this.__message) {
			this.__message.replaceWithComponent(message, true);
		} else {
			this.addChildComponentInside(message, this.contentElement);
		}

		this.__message = message;
		this.__message.addClass('alert-message');
		this.toggleClass('alert-message-empty', this.__message.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getMessage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getMessage: function() {
		return this.__message;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButton: function(button, where) {
		return this.addChildComponentInside(moobile.Button.from(button), this.footerElement, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtonAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonAfter: function(button, after) {
		return this.addChildComponentAfter(moobile.Button.from(button), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtonBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addButtonBefore: function(button, before) {
		return this.addChildComponentBefore(moobile.Button.from(button), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtons: function(buttons, where) {
		return this.addChildComponentsInside(buttons.map(function(button) {
			return moobile.Button.from(button);
		}), this.footerElement, where);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtonsAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtonsAfter: function(buttons, after) {
		return this.addChildComponentsAfter(buttons.map(function(button) {
			return moobile.Button.from(button);
		}), after);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#addButtonsBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addButtonsBefore: function(buttons, before) {
		return this.addChildComponentBefore(buttons.map(function(button) {
			return moobile.Button.from(button);
		}), before);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButtons: function() {
		return this.getChildComponentsByType(moobile.Button);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButton: function(name) {
		return this.getChildComponentByType(moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#getButtonAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentByTypeAt(moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.2.0
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponentsByType(moobile.Button, destroy);
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
		return this.setDefaultButton(this.getChildComponentByTypeAt(moobile.Button, index));
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Dialog/Alert#showAnimated
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	showAnimated: function() {
		this.willShow();
		this.element.addClass('show-animated').removeClass('hidden');
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
	didAddChildComponent: function(component) {
		this.parent(component);
		if (component instanceof moobile.Button) {
			component.addEvent('tap', this.bound('__onButtonTap'));
			this.__buttons.include(component);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	didRemoveChildComponent: function(component) {
		this.parent(component);
		if (component instanceof moobile.Button) {
			component.removeEvent('tap', this.bound('__onButtonTap'));
			this.__buttons.erase(component);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	willShow: function() {

		if (this.getParentView() === null) {
			var instance = moobile.Window.getCurrentInstance();
			if (instance) {
				instance.addChildComponent(this);
			}
		}

		if (this.__buttons.length === 0) this.addButton('OK');

		this.parent();
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

	/* Private API */

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	__onButtonTap: function(e, sender) {

		var index = this.getChildComponentsByType(moobile.Button).indexOf(sender);
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
	__onAnimationEnd: function(e) {

		e.stop()

		if (this.hasClass('show-animated')) {
			this.removeClass('show-animated')
			this.didShow()
		}

		if (this.hasClass('hide-animated')) {
			this.addClass('hidden').removeClass('hide-animated')
			this.didHide()
		}
	}

});
