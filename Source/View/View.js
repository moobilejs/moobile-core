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
	 * The view content.
	 * @type   ViewContent
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	content: null,

	/**
	 * The view that owns this view.
	 * @type   View
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	parentView: null,

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

		if (this.hasChild(entity))
			return false;

		if (entity instanceof Moobile.View)
			entity.setParentView(this);

		if (entity instanceof Moobile.ViewContent)
			return this.parent(entity, where, context);

		if (where == 'header')
			return this.parent(entity, 'top');

		if (where == 'footer')
			return this.parent(entity, 'bottom');

		if (this.content == null)
			return this.parent(entity, where, context);

		// the entity is in the view but not in the view content
		if (this.hasElement(entity) && !this.content.hasElement(entity))
			return this.parent(entity, where, context);

		// the entity will go next to an element that is in the view but not in the view content
		if (this.hasElement(context) && !this.content.hasElement(context))
			return this.parent(entity, where, context);

		return this.content.addChild(entity, where, context);
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
		return this.content
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
		return this.content
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
	getChildren: function(type) {
		return [].concat(this.parent(type), this.content.getChildren(type));
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
		return this.content
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
		return this.content
		     ? this.content.removeChild(entity) || this.parent(entity)
		     : this.parent(entity);
	},

	/**
	 * Set the view that owns this view.
	 *
	 * This method should be used instead of `setParent` because it will set
	 * an view instead of a view content.
	 *
	 * @return {View} This view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setParentView: function(parentView) {
		this.parentViewWillChange(parentView);
		this.parentView = parentView;
		this.parentViewDidChange(parentView);
		return this;
	},

	/**
	 * Returns the view that owns this view.
	 *
	 * This method should be used instead of `getParent` because it will return
	 * an view instead of a view content.
	 *
	 * @return {View} The view that owns this view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParentView: function() {
		return this.parentView;
	},

	/**
	 * Sets the view content.
	 *
	 * This method will set the entity that is used as the content of this
	 * view. This entity will contains all child entities except ones in this
	 * view's header or footer.
	 *
	 * @param {ViewContent} content The view content.
	 *
	 * @return {View} This view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setContent: function(content) {

		if (this.content == content)
			return this;

		if (this.content == null) {
			this.addChild(content);
			this.content = content;
		} else {
			this.replaceChild(this.content, content);
			this.content.destroy();
			this.content = content;
		}

		return this;
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

	willBuild: function() {

		this.parent();

		this.element.addClass('view');

		var content = this.getRoleElement('view-content');
		if (content == null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
		}

		this.attachRole(content, 'view-content');
	},

	/**
	 * Tell the view it's about to be moved to a new view.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @param {View} parentView The view that will own this view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewWillChange: function(parentView) {

	},

	/**
	 * Tell the view it has been moved to a new view.
	 *
	 * The current implementation of this method does nothing. However it's a
	 * good practice to call the parent at the top of your implementation as
	 * the content of this method may change in the future.
	 *
	 * @param {View} parentView The view that owns this view.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewDidChange: function(parentView) {

	},

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

Moobile.Entity.defineRole('view', null, function(element) {
	var instance = Moobile.Entity.fromElement(element, 'data-view', Moobile.View);
	this.addChild(instance);
});
