/*
---

name: View

description: Provides an entity that handles an area in which a user can
             interract.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Entity

provides:
	- View

...
*/

/**
 * @class
 *
 * Provides an entity that handles an area in which a user can interract. The
 * View is generally the root of a page.
 *
 * <h2>Roles</h2>
 *
 * <p><code>view</code> - Defined for all classes that extends the Entity
 * class, you may specify the view class using the <code>data-view</code>
 * attribute.</p>
 *
 * @name    View
 * @extends Entity
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.View = new Class( /** @lends View.prototype */ {

	Extends: Moobile.Entity,

	/**
	 * This view's content.
	 *
	 * @see View#getContent
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	content: null,

	/**
	 * Enables the user interaction of the view.
	 *
	 * @return {View} This view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	enableTouch: function() {
		this.element.removeClass('disable').addClass('enable');
		return this;
	},

	/**
	 * Disables the user interaction of the view.
	 *
	 * @return {View} This view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	disableTouch: function() {
		this.element.removeClass('enable').addClass('disable');
		return this;
	},

	/**
	 * Adds a child to the view content or the view itself. Use
	 * <code>header</code> or <code>footer</code> as second parameter to add a
	 * child at the top or bottom of the view itself.
	 *
	 * @see Entity#addChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChild: function(entity, where, context) {

		if (entity instanceof Moobile.ViewContent) {
			return this.parent(entity, where, context);
		}

		switch (where) {
			case 'header': return this.parent(entity, 'top');
			case 'footer': return this.parent(entity, 'bottom');
		}

		if (this.content && this.content.hasOwner()) {

			if (this.hasChild(entity)) {
				return false;
			}

			if (this.hasElement(entity) && !this.content.hasElement(entity) ||
				this.hasElement(context) && !this.content.hasElement(context)) {
				return this.parent(entity, where, context);
			}

			return this.content.addChild(entity, where, context);
		}

		return this.parent(entity, where, context);
	},

	/**
	 * Returns a child from the view or the view content.
	 *
	 * @see Entity#getChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChild: function(name) {
		return this.content && this.content.hasOwner()
			 ? this.content.getChild(name) || this.parent(name)
			 : this.parent(name);
	},

	/**
	 * Indicates whether child exists in the view or the view content.
	 *
	 * @see Entity#hasChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChild: function(entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.hasChild(entity) || this.parent(entity)
		     : this.parent(entity);
	},

	/**
	 * Replaces a child from the view or the view content.
	 *
	 * @see Entity#replaceChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceChild: function(replace, entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.replaceChild(replace, entity) || this.parent(replace, entity)
		     : this.parent(replace, entity);
	},

	/**
	 * Removes a child from the view or the view content.
	 *
	 * @see Entity#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChild: function(entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.removeChild(entity) || this.parent(entity)
		     : this.parent(entity);
	},

	/**
	 * Returns the children of the view and the view content.
	 *
	 * @see Entity#getChildren
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildren: function() {
		return [].concat(this.content.getChildren(), this.parent());
	},

	/**
	 * Returns the view who owns this view.
	 *
	 * @return {View} The view that owns this view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getOwnerView: function() {

		var owner = this.owner;
		while (owner) {

			if (owner instanceof Moobile.View) {
				return owner;
			}

			owner = owner.getOwner();
		}

		return null;
	},

	/**
	 * Returns this view's content.
	 *
	 * @return {ViewContent} This view's content.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getContent: function() {
		return this.content;
	},

	/**
	 * Defines an element with the view-content role if it was not yet
	 * defined for this view.
	 *
	 * @see Entity#willLoad
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willLoad: function() {

		this.parent();

		var content = this.getRoleElement('view-content');
		if (content == null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
		}

		this.defineElementRole(content, 'view-content');
	},

	/**
	 * Adds the proper css classes to this view's element.
	 *
	 * @see Entity#didLoad
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didLoad: function() {
		this.parent();
		this.element.addClass('view');
	},

	/**
	 * @see Entity#destroy
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {
		this.content = null;
		this.parent();
	}

});

/**
 * Return the view element of a file at a given path.
 *
 * @param {String} path The file path.
 *
 * @return {Element} The element or <code>null</code> if no elements were found.
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.View.elementAtPath = function(path) {
	return new Moobile.Request.ViewElement().load(path);
};

/**
 * Return the view of a file at a given path.
 *
 * @param {String} path The file path.
 *
 * @return {View} The view or <code>null</code> if no view were found.
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @since  0.1
 */
Moobile.View.atPath = function(path) {

	var element = Moobile.View.elementAtPath(path);
	if (element) {
		return Moobile.Entity.fromElement(element, 'data-view', Moobile.View);
	}

	return null;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Entity.defineRole('view', null, function(element, name) {
	var instance = Moobile.Entity.fromElement(element, 'data-view', Moobile.View);
	this.addChild(instance);
});
