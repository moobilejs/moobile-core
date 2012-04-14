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
 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Alert = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_title: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_message: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_buttons: [],

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	contentElement: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	dialogHeader: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	dialogFooter: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	dialogContent: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	overlay: null,

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	options: {
		buttonLayout: 'vertical'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('alert');
		this.element.addEvent('animationend', this.bound('_onAnimationEnd'));

		this.overlay = new Moobile.Overlay();
		this.overlay.setStyle('radial');
		this.addChildComponent(this.overlay);

		this.headerElement  = new Element('div.alert-header');
		this.footerElement  = new Element('div.alert-footer');
		this.contentElement = new Element('div.alert-content');

		this.wrapperElement = new Element('div.alert-wrapper');
		this.wrapperElement.grab(this.headerElement);
		this.wrapperElement.grab(this.contentElement);
		this.wrapperElement.grab(this.footerElement);

		this.element.grab(this.wrapperElement);

		var buttonLayout = this.options.buttonLayout;
		if (buttonLayout) {
			this.element.addClass('button-layout-' + buttonLayout);
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		this.element.addEvent('animationend', this.bound('_onAnimationEnd'));

		this._title = null;
		this._message = null;

		this.wrapperElement = null;
		this.headerElement = null;
		this.footerElement = null;
		this.contentElement = null;

		this.overlay.destroy();
		this.overlay = null;

		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		if (typeof title === 'string') {
			title = new Moobile.Text().setText(title);
		}

		if (this._title) {
			this._title.replaceWithComponent(title, true);
		} else {
			this.addChildComponentInside(title, this.headerElement);
		}

		this._title = title;
		this._title.addClass('title');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setMessage: function(message) {

		if (this._message === message)
			return this;

		if (typeof message === 'string') {
			message = new Moobile.Text().setText(message);
		}

		if (this._message) {
			this._message.replaceWithComponent(message, true);
		} else {
			this.addChildComponentInside(message, this.contentElement);
		}

		this._message = message;
		this._message.addClass('message');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getMessage: function() {
		return this._message;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addButton: function(button) {

		if (typeof button === 'string') {
			button = new Moobile.Button().setLabel(button);
		}

		return this.addChildComponentInside(button, this.footerElement);
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setDefaultButton: function(button) {
		if (this.hasChildComponent(button)) button.addClass('default');
		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setDefaultButtonIndex: function(index) {
		return this.setDefaultButton(this.getChildComponentOfTypeAt(Moobile.Button, index));
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
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
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
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
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Moobile.Button) {
			child.addEvent('tap', this.bound('_onButtonTap'));
			this._buttons.include(child);
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChildComponent: function(child) {
		this.parent(child);
		if (child instanceof Moobile.Button) {
			child.removeEvent('tap', this.bound('_onButtonTap'));
			this._buttons.erase(child);
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willShow: function() {
		this.parent();
		if (this._buttons.length === 0) {
			var button = new Moobile.Button();
			button.setLabel('OK');
			this.addButton(button);
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didHide: function() {
		this.parent();
		this.destroy();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onButtonTap: function(e, sender) {

		var index = this.getChildComponentsOfType(Moobile.Button).indexOf(sender);
		if (index >= 0) {
			this.fireEvent('dismiss', [sender, index]);
		}

		this.hideAnimated();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Dialog/Alert
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
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
