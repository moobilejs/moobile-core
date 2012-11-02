/*
---

name: NavigationBar

description: Provides a bar control used to navigate between views.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Bar

provides:
	- NavigationBar

...
*/

/**
 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.NavigationBar = new Class({

	Extends: Moobile.Bar,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	_title: null,

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	willBuild: function() {

		this.parent();

		this.addClass('navigation-bar');

		var title = this.getRoleElement('title');
		if (title === null) {
			title = document.createElement('div');
			title.ingest(this.element);
			title.inject(this.element);
			title.setRole('title');
		}

		var wrapper = document.createElement('div');
		wrapper.addClass('bar-title-wrapper');
		wrapper.wraps(title);
	},

	/**
	 * @overridden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	destroy: function() {
		this._title = null;
		this.parent();
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		title = Moobile.Text.from(title);

		if (this._title) {
			this._title.replaceWithComponent(title, true);
		} else {
			this.addChildComponent(title);
		}

		this._title = title;
		this._title.addClass('bar-title');
		this.toggleClass('bar-title-empty', this._title.isEmpty());

		return this;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#addLeftButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addLeftButton: function(button) {
		return this.addChildComponent(button, 'top');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#addRightButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	addRightButton: function(button) {
		return this.addChildComponent(button, 'bottom');
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getButton: function(name) {
		return this.getChildComponentOfType(Moobile.Button, name);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#getButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	getButtonAt: function(index) {
		return this.getChildComponentOfTypeAt(Moobile.Button, index);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#removeButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeButton: function(button, destroy) {
		return this.removeChildComponent(button, destroy);
	},

	/**
	 * @see    http://moobilejs.com/doc/latest/Control/NavigationBar#removeAllButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.3.0
	 */
	removeAllButtons: function(destroy) {
		return this.removeAllChildComponents(Moobile.Button, destroy);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1.0
 */
Moobile.Component.defineRole('navigation-bar', null, null, function(element) {
	this.addChildComponent(Moobile.Component.create(Moobile.NavigationBar, element, 'data-navigation-bar'));
});

/**
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.3.0
 */
Moobile.Component.defineRole('title', Moobile.NavigationBar, null, function(element) {
	this.setTitle(Moobile.Component.create(Moobile.Text, element, 'data-title'));
});
