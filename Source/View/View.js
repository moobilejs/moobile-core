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
 * Provides an entity that handles an area in which a user can interract.
 *
 * @name View
 * @class View
 * @extends Entity
 *
 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.View = new Class( /** @lends View.prototype */ {

	Extends: Moobile.Entity,

	/**
	 * The view content.
	 * @type {ViewContent}
	 */
	content: null,

	/**
	 * Enable the user interaction of the view.
	 * @return {View}
	 * @since 0.1
	 */
	enableTouch: function() {
		this.element.removeClass('disable').addClass('enable');
		return this;
	},

	/**
	 * Disable the user interaction of the view.
	 * @return {View}
	 * @since 0.1
	 */
	disableTouch: function() {
		this.element.removeClass('enable').addClass('disable');
		return this;
	},

	/**
	 * Add a child to the view content or the view itself. Use
	 * <code>header</code> or <code>footer</code> as second parameter to add a
	 * child at the top or bottom of the view itself.
	 * @since 0.1
	 * @see Entity#addChild
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
	 * Return a child from the view or the view content.
	 * @since 0.1
	 * @see Entity#getChild
	 */
	getChild: function(name) {
		return this.content && this.content.hasOwner()
			 ? this.content.getChild(name) || this.parent(name)
			 : this.parent(name);
	},

	/**
	 * Indicate whether child exists in the view or the view content.
	 * @since 0.1
	 * @see Entity#hasChild
	 */
	hasChild: function(entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.hasChild(entity) || this.parent(entity)
		     : this.parent(entity);
	},

	/**
	 * Replace a child from the view or the view content.
	 * @since 0.1
	 * @see Entity#replaceChild
	 */
	replaceChild: function(replace, entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.replaceChild(replace, entity) || this.parent(replace, entity)
		     : this.parent(replace, entity);
	},

	/**
	 * Remove a child from the view or the view content.
	 * @since 0.1
	 * @see Entity#removeChild
	 */
	removeChild: function(entity) {
		return this.content && this.content.hasOwner()
		     ? this.content.removeChild(entity) || this.parent(entity)
		     : this.parent(entity);
	},

	/**
	 * Return the children of the view and the view content.
	 * @since 0.1
	 * @see Entity#getChildren
	 */
	getChildren: function() {
		return [].concat(this.content.getChildren(), this.parent());
	},

	/**
	 * Return the view who owns this view.
	 * @return {View}
	 * @since 0.1
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
	 * Return the view content.
	 * @return {ViewContent}
	 * @since 0.1
	 */
	getContent: function() {
		return this.content;
	},

	/**
	 * @see Entity#willLoad
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
	 * @see Entity#didLoad
	 */
	didLoad: function() {
		this.parent();
		this.element.addClass('view');
	},

	/**
	 * @see Entity#destroy
	 */
	destroy: function() {
		this.content = null;
		this.parent();
	}

});

/**
 * Return the view element of a file at a given path.
 * @param {String} path The file path.
 * @return {Element}
 * @since 0.1
 */
Moobile.View.elementAtPath = function(path) {
	return new Moobile.Request.ViewElement().load(path);
};

/**
 * Return the view of a file at a given path.
 * @param {String} path The file path.
 * @return {View}
 * @since 0.1
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
