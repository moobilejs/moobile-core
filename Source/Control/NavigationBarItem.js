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
 * Provides the navigation bar item that contains the title and buttons at the
 * left and right of it.
 *
 * @name NavigationBarItem
 * @class NavigationBarItem
 * @extends BarItem
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.NavigationBarItem = new Class( /** @lends NavigationBarItem.prototype */ {

	Extends: Moobile.BarItem,

	/**
	 * The title.
	 * @type {NavigationBarItemTitle}
	 */
	title: null,

	/**
	 * Set the title as a string or as an instance of NavigationBarItemTitle.
	 * @param {NavigationBarItemTitle|String} title The title.
	 * @return {NavigationBarItem}
	 * @since 0.1
	 */
	setTitle: function(title) {

		if (this.title === title)
			return this;

		if (typeof title == 'string') {
			this.title.setText(title);
			return this;
		}

		this.replaceChild(this.title, title);
		this.title.destroy();
		this.title = title;

		return this;
	},

	/**
	 * Return the navigation bar item title.
	 * @return {NavigationBarItemTitle}
	 * @since 0.1
	 */
	getTitle: function() {
		return this.title;
	},

	/**
	 * Add a button at the left of the title.
	 * @see Entity#addChild.
	 */
	addLeftBarButton: function(button) {
		return this.addChild(button, 'top');
	},

	/**
	 * Add a button at the right of the title.
	 * @see Bar#addBarButton.
	 */
	addRightBarButton: function(button) {
		return this.addChild(button, 'bottom');
	},

	/**
	 * Return a bar button from the bar item.
	 * @see Entity#getChild
	 */
	getBarButton: function(name) {
		return this.getChild(name);
	},

	/**
	 * Remove a bar button from the bar item.
	 * @see Entity#removeChild
	 */
	removeBarButton: function(item) {
		return this.removeChild(item);
	},

	/**
	 * Remove all bar buttons from the bar item.
	 * @see Entity#removeChildren
	 */
	removeAllBarButtons: function() {
		return this.removeChildren();
	},

	/**
	 * @see Entity#willLoad
	 */
	willLoad: function() {

		this.parent();

		var title = this.getRoleElement('title');

		if (title == null) {
			title = new Element('div');
			title.ingest(this.element);
			title.inject(this.element);
		}

		this.defineElementRole(title, 'title');
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {

		this.parent();

		var className = this.options.className;
		if (className) {
			this.element.addClass('navigation-' + className);
		}
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.title = null;
		this.parent();
	},

});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('title', Moobile.NavigationBarItem, function(element, name) {

	var instance = Class.instantiate(element.get('title') || Moobile.NavigationBarItemTitle, element, null, name);
	if (instance instanceof Moobile.NavigationBarItemTitle) {
		this.addChild(instance);
		this.title = instance;
	}

	return instance;
});
