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
	 * @var    {BarItem} This bar's item.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	item: null,

	/**
	 * Sets this bar's item.
	 *
	 * This method will set what represents the content of a bar. Objects such
	 * as buttons, button groups, images should be added to this bar item and
	 * not to the bar itself.
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
			this.addChild(label);
		} else {
			this.replaceChild(this.item, item);
			this.item.destroy();
			this.item = label;
		}

		return this;
	},

	/**
	 * Returns the bar item.
	 *
	 * This method will return what represents the content of a bar. Objects
	 * such as buttons, button groups, images should be added to this bar item
	 * and not to the bar itself.
	 *
	 * @return {BarItem} The bar item.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getItem: function() {
		return this.item;
	},

	destroy: function() {
		this.item = null;
		this.parent();
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

	didLoad: function() {
		this.parent();
		this.element.addClass('bar');
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
