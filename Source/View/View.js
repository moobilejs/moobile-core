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
 * @name  View
 * @class Provides an entity that handles an area in which a user can
 *        interract.
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
 * @extends Entity
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.View = new Class( /** @lends View.prototype */ {

	Extends: Moobile.Entity,

	/**
	 * @var    {ViewContent} The view content.
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	content: null,

	/**
	 * Enables the touch interraction of the view.
	 *
	 * This method will enable the touch interraction of this view by swapping
	 * the CSS class from `disable` to `enable`. This will set the CSS style
	 * `pointer-events` to `auto` thus enabling touch events.
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
	 * Disables the touch interaction of the view.
	 *
	 * This method will disable the touch interraction of this view by swapping
	 * the CSS class from `enable` to `disable`. This will set the CSS style
	 * `pointer-events` to `none` thus disabling touch events.
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
	 * Adds a child entity to this view.
	 *
	 * This method will add a child entity to this view's content entity. You
	 * can add the child entity before or after this view's content entity by
	 * passing `header` or `footer` to the `where` parameter.
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
	 * Returns a child entity from this view.
	 *
	 * This method will attempt to find the given child entity from this view's
	 * content entity then from the view itself if the former failed.
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
	 * Indicates whether an entity is owned by this view.
	 *
	 * This method will attempt to find the given child entity from this view's
	 * content entity then from the view itself if the former failed.
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
	 * Returns all the child entities from this view.
	 *
	 * This method will return an array that contains both the child entites
	 * from this view and the child entities from this view's content entity.
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
	 * Replaces a child entity with another within this view.
	 *
	 * This method will attempt to replace the entity from this view's content
	 * entity first then from the view itself if the former failed.
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
	 * Removes a child entity.
	 *
	 * This method will attempt to remove the entity from this view's content
	 * entity first then from the view itself if the former failed.
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
	 * Returns the view that owns this view.
	 *
	 * This method should be used instead of `getOwner` because it will return
	 * an view instead of a view content.
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
	 * Returns the view content.
	 *
	 * This method will return the entity that is used as the content of this
	 * view. This entity will contains all child entities except ones in this
	 * view's header or footer.
	 *
	 * @return {ViewContent} The view content.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getContent: function() {
		return this.content;
	},

	destroy: function() {
		this.content = null;
		this.parent();
	},

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

	didLoad: function() {
		this.parent();
		this.element.addClass('view');
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

Moobile.Entity.defineRole('view', null, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-view', Moobile.View);
	this.addChild(instance);
});
