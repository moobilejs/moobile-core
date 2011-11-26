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
Moobile.NavigationBarItem = new Class(/** @lends NavigationBarItem.prototype */ {

	Extends: Moobile.BarItem,

	/**
	 * The navigation bar item title.
	 * @type {BarTitle}
	 */
	title: null,

	/**
	 * Set the navigation bar item title.
	 * @param {Mixed} title The title as an instance of BarTitle or as a string.
	 * @return {NavigationBarItem}
	 * @since 0.1
	 */
	setTitle: function(title) {

		if (this.title === title)
			return this;

		this.title.setText(null);
		this.title.hide();

		if (title) {
			if (typeof title == 'string') {
				this.title.setText(title);
				this.title.show();
			} else {
				this.replaceChildView(this.title, title);
				this.title.destroy();
				this.title = title;
			}
		}

		return this;
	},

	/**
	 * Return the navigation bar item title.
	 * @return {BarTitle}
	 * @since 0.1
	 */
	getTitle: function() {
		return this.title;
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

	var instance = Class.instantiate(element.get('title') || Moobile.BarTitle, element, null, name);
	if (instance instanceof Moobile.BarTitle) {
		this.addChild(instance);
		this.title = instance;
	}

	return instance;
});
