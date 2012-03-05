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
 * @see    http://moobile.net/api/0.1/Control/NavigationBarItem
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.NavigationBarItem = new Class( /** @lends NavigationBarItem.prototype */ {

	Extends: Moobile.BarItem,

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_title: null,

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('navigation-bar-item');

		var title = this.element.getRoleElement('title');
		if (title === null) {
			title = new Element('div');
			title.ingest(this.element);
			title.inject(this.element);
			title.setRole('title');
		}

		var wrapper = this.element.getElement('.bar-title');
		if (wrapper == null) {
			wrapper = new Element('div.bar-title');
			wrapper.wraps(title);
		}
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this._title = null;
		this.parent();
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/NavigationBarItem#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		if (typeof title === 'string') {
			title = new Moobile.Text().setText(title);
		}

		if (this._title) {
			this._title.replaceWith(title, true);
		} else {
			this.addChildInside(title, null, '.bar-title');
		}

		this._title = title;
		this._title.addClass('title');

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/NavigationBarItem#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/NavigationBarItem#addLeftBarButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addLeftBarButton: function(button) {
		return this.addChild(button, 'top');
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/NavigationBarItem#addRightBarButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addRightBarButton: function(button) {
		return this.addChild(button, 'bottom');
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/NavigationBarItem#getBarButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getBarButton: function(name) {
		return this.getChildOfType(Moobile.BarButton, name);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/NavigationBarItem#getBarButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getBarButtonAt: function(index) {
		return this.getChildOfTypeAt(Moobile.BarButton, index);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/NavigationBarItem#removeBarButton
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeBarButton: function(button, destroy) {
		return this.removeChild(button, destroy);
	},

	/**
	 * @see    http://moobile.net/api/0.1/Control/NavigationBarItem#removeAllBarButtons
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeAllBarButtons: function(destroy) {
		return this.removeChildren(Moobile.Button, destroy);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('item', Moobile.NavigationBar, function(element) {
	this.setItem(Moobile.Component.create(Moobile.NavigationBarItem, element, 'data-item'));
});

Moobile.Component.defineRole('title', Moobile.NavigationBarItem, function(element) {
	this.setTitle(Moobile.Component.create(Moobile.Text, element, 'data-title'));
});
