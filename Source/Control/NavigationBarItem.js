/*
---

name: NavigationBarItem

description: Provides the navigation bar item that contains the title and
             buttons at the left and right of it.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- BarItem

provides:
	- NavigationBarItem

...
*/

/**
 * @name  NavigationBarItem
 * @class Provides a navigation bar item control.
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
 * @extends BarItem
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.NavigationBarItem = new Class( /** @lends NavigationBarItem.prototype */ {

	Extends: Moobile.BarItem,

	/**
	 * @var    {Label} The title.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	title: null,

	destroy: function() {
		this.title = null;
		this.parent();
	},

	/**
	 * Sets the title.
	 *
	 * This method will set the title using either a string or an instance of a
	 * `Label`. When provided with a string, this methods creates a `Label`
	 * instance and assign the given string as its text.
	 *
	 * @param {Mixed} title The title as a string or a `Label` instance.
	 *
	 * @return {NavigationBarItem} This navigation bar item.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		if (this.title === title)
			return this;

		if (typeof title == 'string') {
			var text = title;
			title = new Moobile.Label();
			title.setText(text);
		}

		if (this.title == null) {
			this.title = title;
			this.addChild(title);
		} else {
			this.replaceChild(this.title, title);
			this.title.destroy();
			this.title = title;
		}

		this.title.addClass('bar-title');

		return this;
	},

	/**
	 * Returns the title.
	 *
	 * @return {NavigationBarItemTitle} The title.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this.title;
	},

	/**
	 * Adds a button at the left of the title.
	 *
	 * @see Entity#addChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addLeftBarButton: function(button) {
		return this.addChild(button, 'top');
	},

	/**
	 * Adds a button at the right of the title.
	 *
	 * @see Entity#addChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addRightBarButton: function(button) {
		return this.addChild(button, 'bottom');
	},

	/**
	 * Returns a bar button.
	 *
	 * @see Entity#getChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getBarButton: function(name) {
		return this.getChild(name);
	},

	/**
	 * Removes a bar button.
	 *
	 * @see Entity#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeBarButton: function(item) {
		return this.removeChild(item);
	},

	/**
	 * Removes all bar buttons.
	 *
	 * @see Entity#removeChildren
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllBarButtons: function() {
		return this.removeChildren();
	},

	willBuild: function() {

		this.parent();

		this.element.addClass('navigation-bar-item');

		var title = this.getRoleElement('title');
		if (title == null) {
			title = new Element('div');
			title.ingest(this.element);
			title.inject(this.element);
		}

		this.attachRole(title, 'title');
	}
});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('item', Moobile.NavigationBar, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-item', Moobile.NavigationBarItem);
	this.setItem(instance);
});

Moobile.Entity.defineRole('title', Moobile.NavigationBarItem, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-title', Moobile.Label);
	this.setTitle(instance);
});
