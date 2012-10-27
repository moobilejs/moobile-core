/*
---

name: Bar

description: Provides a control that displays a bar.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Bar

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/Bar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @edited 0.2.0
 * @since  0.1.0
 */
Moobile.Bar = new Class({

	Extends: Moobile.Control,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_item: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('bar');

		var item = this.getRoleElement('item');
		if (item === null) {
			item = document.createElement('div');
			item.ingest(this.element);
			item.inject(this.element);
			item.setRole('item');
		}
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	destroy: function() {
		this._item = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Bar#setItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setItem: function(item) {

		if (this._item === item)
			return this;

		if (this._item) {
			this._item.replaceWithComponent(item, true);
		} else {
			this.addChildComponent(item);
		}

		this._item = item;
		this._item.addClass('bar-item');

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/Bar#getItem
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function() {
		return this._item;
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('bar', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.Bar, element, 'data-bar'));
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

/* Dark Style - iOS - Android */
Moobile.Component.defineStyle('dark', Moobile.Bar, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

/* Light Style - iOS - Android */
Moobile.Component.defineStyle('light', Moobile.Bar, {
	attach: function(element) { element.addClass('style-light'); },
	detach: function(element) { element.removeClass('style-light'); }
});
