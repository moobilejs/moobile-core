/*
---

name: ListHeader

description: Provides a list item header control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- ListItem

provides:
	- ListHeader

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/ListHeader
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.2.0
 */
Moobile.ListHeader = new Class({

	Extends: Moobile.Component,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_label: null,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	options: {
		tagName: 'li'
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('list-header');

		var label  = this.getRoleElement('label');
		if (label === null) {
			label = document.createElement('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#setLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @edited 0.2.0
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this._label === label)
			return this;

		label = label || '';
		if (typeof label === 'string') {
			label = new Moobile.Text().setText(label);
		}

		if (this._label) {
			this._label.replaceWithComponent(label, true);
		} else {
			this.addChildComponent(label);
		}

		this._label = label;
		this._label.addClass('list-header-label');

		this.element.toggleClass('no-list-header-label', this._label.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/ListItem#getLabel
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this._label;
	},

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('header', Moobile.List, null, function(element) {
	this.addItem(Moobile.Component.create(Moobile.ListHeader, element, 'data-header'));
});

Moobile.Component.defineRole('label', Moobile.ListHeader, null, function(element) {
	this.setLabel(Moobile.Component.create(Moobile.Text, element, 'data-label'));
});
