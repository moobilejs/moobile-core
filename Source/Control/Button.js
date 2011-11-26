/*
---

name: Button

description: Provides a Button control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Button

...
*/

/**
 * Provides a Button control.
 *
 * @name Button
 * @class Button
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Button = new Class(/** @lends Button.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The button label entity.
	 * @type {Label}
	 */
	label: null,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'button',
	},

	/**
	 * Set the button label.
	 * @param {Mixed} label The label as a Label instance or as a string.
	 * @return {Object}
	 * @since 0.1
	 */
	setLabel: function(label) {

		if (this.label === label)
			return this;

		this.label.setText(null);

		if (label) {
			if (typeof label == 'string') {
				this.label.setText(label);
			} else {
				this.replaceChild(this.label, label);
				this.label.destroy();
				this.label = label;
			}
		}

		return this;
	},

	/**
	 * Return the button label.
	 * @return {Label}
	 * @since 0.1
	 */
	getLabel: function() {
		return this.label;
	},

	/**
	 * @see Entity#willLoad
	 */
	willLoad: function() {

		this.parent();

		var label = this.getRoleElement('label');
		if (label == null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
		}

		this.defineElementRole('label', label);
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.label = null;
		this.parent();
	},

	/**
	 * Mouse down event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @private
	 */
	onMouseDown: function(e) {
		this.parent(e);
		this.element.addClass(this.options.className + '-down');
	},

	/**
	 * Mouse up event handler.
	 * @param {Event} e The event.
	 * @since 0.1
	 * @private
	 */
	onMouseUp: function(e) {
		this.parent(e);
		this.element.removeClass(this.options.className + '-down');
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('button', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-button') || Moobile.Button, element, null, name);
	if (instance instanceof Moobile.Button) {
		this.addChild(instance);
	}

	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('label', Moobile.Button, function(element, name) {

	var instance = Class.instantiate(element.get('data-label') || Moobile.Label, element, null, name);
	if (instance instanceof Moobile.Entity) {
		this.addChild(instance);
		this.label = instance;
	}

	return instance;
});
