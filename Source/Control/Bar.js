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
		this.replaceChild(this.item, item);
		this.item.destroy();
		this.item = item;
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
	 * Add a bar button to the bar item.
	 * @since 0.1
	 * @see Entity#addChild
	 */
	addBarButton: function(item, where, context) {
		return this.item.addChild(item, where, context);
	},

	/**
	 * Return a bar button from the bar item.
	 * @since 0.1
	 * @see Entity#getChild
	 */
	getBarButton: function(name) {
		return this.item.getChild(name);
	},

	/**
	 * Remove a bar button from the bar item.
	 * @since 0.1
	 * @see Entity#removeChild
	 */
	removeBarButton: function(item) {
		return this.item.removeChild(item);
	},

	/**
	 * Remove all bar buttons from the bar item.
	 * @since 0.1
	 * @see Entity#removeChildren
	 */
	removeAllBarButton: function() {
		return this.item.removeChildren();
	},



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

	destroy: function() {
		this.item = null;
		this.parent();
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-bar') || Moobile.Bar, element, null, name);
	if (instance instanceof Moobile.Bar) {
		this.addChild(instance);
	}

	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('item', Moobile.Bar, function(element, name) {

	var instance = Class.instantiate(element.get('data-item') || Moobile.BarItem, element, null, name);
	if (instance instanceof Moobile.BarItem) {
		this.addChild(instance);
		this.item = instance;
	}

	return instance;
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
