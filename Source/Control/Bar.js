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
 * @name  Bar
 * @class Provides a bar control.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends Control
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Bar = new Class( /** @lends Bar.prototype */ {

	Extends: Moobile.Control,

	/**
	 * @var    {BarItem} The bar item.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	item: null,

	destroy: function() {
		this.item = null;
		this.parent();
	},

	/**
	 * Sets the bar item.
	 *
	 * This method will set the object that contains buttons, button groupes,
	 * images and so on in a bar control.
	 *
	 * @param {BarItem} item The bar item.
	 *
	 * @return {Bar} This bar.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setItem: function(item) {

		if (this.item === item)
			return this;

		if (this.item == null) {
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
	 * Returns the bar item.
	 *
	 * This method will return the object that contains buttons, button groupes,
	 * images and so on in a bar control.
	 *
	 * @return {BarItem} The bar item.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function() {
		return this.item;
	},

	willBuild: function() {

		this.parent();

		this.element.addClass('bar');

		var item = this.getRoleElement('item');
		if (item == null) {
			item = new Element('div');
			item.ingest(this.element);
			item.inject(this.element);
		}

		this.attachRole(item, 'item');
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('bar', null, function(element) {
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
