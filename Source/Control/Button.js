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
 * @see    http://moobilejs.com/doc/0.1/Control/Button
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.Button = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_label: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('button');

		var label = this.element.getRoleElement('label');
		if (label === null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		this.addEvent('tapstart', this.bound('_onTapStart'));
		this.addEvent('tapend', this.bound('_onTapEnd'));
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this.removeEvent('tapstart', this.bound('_onTapStart'));
		this.removeEvent('tapend', this.bound('_onTapEnd'));
		this.label = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Button#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setLabel: function(label) {

		if (this._label === label)
			return this;

		if (typeof label === 'string') {
			label = new Moobile.Text().setText(label);
		}

		if (this._label) {
			this._label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this._label = label;
		this._label.addClass('button-label');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/0.1/Control/Button#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getLabel: function() {
		return this._label;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onTapStart: function(e) {
		if (!this.isSelected()) this.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onTapEnd: function(e) {
		if (!this.isSelected()) this.setHighlighted(false);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('button', null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Button, element, 'data-button'));
});

Moobile.Component.defineRole('label', Moobile.Button, function(element) {
	this.setLabel(Moobile.Component.create(Moobile.Text, element, 'data-label'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Component.defineStyle('active', Moobile.Button, {
	attach: function(element) { element.addClass('style-active'); },
	detach: function(element) { element.removeClass('style-active'); }
});

Moobile.Component.defineStyle('warning', Moobile.Button, {
	attach: function(element) { element.addClass('style-warning'); },
	detach: function(element) { element.removeClass('style-warning'); }
});

Moobile.Component.defineStyle('back', Moobile.Button, {
	attach: function(element) { element.addClass('style-back'); },
	detach: function(element) { element.removeClass('style-back'); }
});

Moobile.Component.defineStyle('forward', Moobile.Button, {
	attach: function(element) { element.addClass('style-forward'); },
	detach: function(element) { element.removeClass('style-forward'); }
});

