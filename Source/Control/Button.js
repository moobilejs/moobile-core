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
 * @see    http://moobilejs.com/doc/latest/Control/Button
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Button = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_label: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('button');

		var label = this.getRoleElement('label');
		if (label === null) {
			label = document.createElement('div');
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
	 * @since  0.1.0
	 */
	destroy: function() {
		this.removeEvent('tapstart', this.bound('_onTapStart'));
		this.removeEvent('tapend', this.bound('_onTapEnd'));
		this.label = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Button#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this._label === label)
			return this;

		label = Moobile.Text.from(label);

		if (this._label) {
			this._label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this._label = label;
		this._label.addClass('button-label');
		this.toggleClass('button-label-empty', this._label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Button#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this._label;
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTapStart: function(e) {
		if (!this.isSelected()) this.setHighlighted(true);
	},

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_onTapEnd: function(e) {
		if (!this.isSelected()) this.setHighlighted(false);
	}

});

/**
 * @see    http://moobilejs.com/doc/latest/Control/Button#from
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.Button.from = function(source) {
	if (source instanceof Moobile.Button) return source;
	var button = new Moobile.Button();
	button.setLabel(source);
	return button;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('button', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Button, element, 'data-button'));
});

Moobile.Component.defineRole('label', Moobile.Button, null, function(element) {
	this.setLabel(Moobile.Component.create(Moobile.Text, element, 'data-label'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/* Active Style - iOS */
Moobile.Component.defineStyle('active', Moobile.Button, {
	attach: function(element) { element.addClass('style-active'); },
	detach: function(element) { element.removeClass('style-active'); }
});

/* Warning Style - iOS */
Moobile.Component.defineStyle('warning', Moobile.Button, {
	attach: function(element) { element.addClass('style-warning'); },
	detach: function(element) { element.removeClass('style-warning'); }
});

/* Back Style - iOS Android */
Moobile.Component.defineStyle('back', Moobile.Button, {
	attach: function(element) { element.addClass('style-back'); },
	detach: function(element) { element.removeClass('style-back'); }
});

/* Forward Style - iOS Android */
Moobile.Component.defineStyle('forward', Moobile.Button, {
	attach: function(element) { element.addClass('style-forward'); },
	detach: function(element) { element.removeClass('style-forward'); }
});

