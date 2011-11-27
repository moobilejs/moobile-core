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
 * Provides a control that displays a bar.
 *
 * @name Bar
 * @class Bar
 * @extends Control
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Bar = new Class( /** @lends Bar.prototype */ {

	Extends: Moobile.Control,

	/**
	 * The class options.
	 * @type {Object}
	 */
	options: {
		className: 'bar'
	},

	/**
	 * The bar item.
	 * @type {BarItem}
	 */
	item: null,

	/**
	 * Set the bar item.
	 * @param {BarItem} item The bar item.
	 * @return {Bar}
	 * @since 0.1
	 */
	setItem: function(item) {

		if (this.item === item)
			return this;

		if (this.item == null) {
			this.item = item;
			this.addChild(item);
		} else {
			this.replaceChild(this.item, item);
			this.item.destroy();
			this.item = item;
		}

		return this;
	},

	/**
	 * Return the bar item.
	 * @return {BarItem}
	 * @since 0.1
	 */
	getItem: function() {
		return this.item;
	},

	/**
	 * @see Entity#willLaod
	 */
	willLoad: function() {

		this.parent();

		var item = this.getRoleElement('item');
		if (item == null) {
			item = new Element('div');
			item.ingest(this.element);
			item.inject(this.element);
		}

		this.defineElementRole(item, 'item');
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.item = null;
		this.parent();
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar', null, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-bar', Moobile.Bar);
	this.setItem(instance);
});

//------------------------------------------------------------------------------
// Styles
//------------------------------------------------------------------------------

Moobile.Entity.defineStyle('translucent', Moobile.Bar, {
	attach: function(element) { element.addClass('style-translucent'); },
	detach: function(element) { element.removeClass('style-translucent'); }
});

Moobile.Entity.defineStyle('dark', Moobile.Bar, {
	attach: function(element) { element.addClass('style-dark'); },
	detach: function(element) { element.removeClass('style-dark'); }
});

Moobile.Entity.defineStyle('dark-translucent', Moobile.Bar, {
	attach: function(element) {
		element
			.addClass('style-dark')
			.addClass('style-dark-translucent');
	},
	detach: function(element) {
		element
			.removeClass('style-dark')
			.removeClass('style-dark-translucent');
	}
});
