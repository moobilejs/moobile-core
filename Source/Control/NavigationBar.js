/*
---

name: NavigationBar

description: Provides a bar control used to navigate between views.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar
	- NavigationBarRoles

provides:
	- NavigationBar

...
*/

/**
 * Provides a bar control used to navigate between views.
 *
 * @name NavigationBar
 * @class NavigationBar
 * @extends Bar
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.NavigationBar = new Class( /* @lends NavigationBar.prototype */ {

	Extends: Moobile.Bar,

	/**
	 * Set the navigation bar item title.
	 * @param {String} title The navigation bar item title.
	 * @return {NavigationBar}
	 * @since 0.1
	 */
	setTitle: function(title) {
		this.item.setTitle(title);
		return this;
	},

	/**
	 * Return the navigation bar item title.
	 * @return {String}
	 * @since 0.1
	 */
	getTitle: function() {
		return this.item.title;
	},

	/**
	 * Add a button at the left of the title.
	 * @see Bar#addBarButton.
	 */
	addLeftBarButton: function(button) {
		return this.addBarButton(button, 'top');
	},

	/**
	 * Add a button at the right of the title.
	 * @see Bar#addBarButton.
	 */
	addRightBarButton: function(button) {
		return this.addBarButton(button, 'bottom');
	},

	/**
	 * @see Entity#didLoad
	 */
	didLoad: function() {

		this.parent();

		if (this.options.className) {
			this.element.addClass('navigation-' + this.options.className);
		}
	}

});

//------------------------------------------------------------------------------
// Global Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('navigation-bar', null, function(element, name) {

	var instance = Class.instantiate(element.get('data-navigation-bar') || Moobile.NavigationBar, element, null, name);
	if (instance instanceof Moobile.NavigationBar) {
		this.addChild(instance);
	}

	return instance;
});

//------------------------------------------------------------------------------
// Child Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('item', Moobile.NavigationBar, function(element, name) {

	var instance = Class.instantiate(element.get('data-item') || Moobile.NavigationBarItem, element, null, name);
	if (instance instanceof Moobile.NavigationBarItem) {
		this.addChild(instance);
		this.item = instance;
	}

	return instance;
});
