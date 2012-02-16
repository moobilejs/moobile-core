/*
---

name: View

description: Provides an child that handles an area in which a user can
             interract.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventDispatcher

provides:
	- View

...
*/

/**
 * @name  View
 * @class Provides an child that handles an area in which a user can
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
 * @extends EventDispatcher
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.View = new Class( /** @lends View.prototype */ {

	Extends: Moobile.Component,

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

	willBuild: function() {

		this.parent();

		this.element.addClass('view');

		var content = this.element.getRoleElement('view-content');
		if (content == null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
			content.setRole('view-content');
		}
	},

	destroy: function() {
		this.content = null;
		this.parent();
	},

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
	 * Adds a child child to this view.
	 *
	 * This method will add a child child to this view's content child. You
	 * can add the child child before or after this view's content child by
	 * passing `header` or `footer` to the `where` parameter.
	 *
	 * @see EventDispatcher#addChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChild: function(child, where, context) {

		if (this.hasChild(child))
			return false;

		if (child instanceof Moobile.View)
			child.setParentView(this);

		if (child instanceof Moobile.ViewContent)
			return this.parent(child, where, context);

		if (where == 'header')
			return this.parent(child, 'top');

		if (where == 'footer')
			return this.parent(child, 'bottom');

		if (this.content == null)
			return this.parent(child, where, context);

		// the child is in the view but not in the view content
		if (this.hasElement(child) && !this.content.hasElement(child))
			return this.parent(child, where, context);

		// the child will go next to an element that is in the view but not in the view content
		if (this.hasElement(context) && !this.content.hasElement(context))
			return this.parent(child, where, context);

		return this.content.addChild(child, where, context);
	},

	/**
	 * Returns a child child from this view.
	 *
	 * This method will attempt to find the given child child from this view's
	 * content child then from the view itself if the former failed.
	 *
	 * @see EventDispatcher#getChild
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
	 * Indicates whether an child is owned by this view.
	 *
	 * This method will attempt to find the given child child from this view's
	 * content child then from the view itself if the former failed.
	 *
	 * @see EventDispatcher#hasChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChild: function(child) {
		return this.content
		     ? this.content.hasChild(child) || this.parent(child)
		     : this.parent(child);
	},

	/**
	 * Returns all the child entities from this view.
	 *
	 * This method will return an array that contains both the child entites
	 * from this view and the child entities from this view's content child.
	 *
	 * @see EventDispatcher#getChildren
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildren: function(type) {
		return [].concat(this.parent(type), this.content.getChildren(type));
	},

	/**
	 * Replaces a child child with another within this view.
	 *
	 * This method will attempt to replace the child from this view's content
	 * child first then from the view itself if the former failed.
	 *
	 * @see EventDispatcher#replaceChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	replaceChild: function(replace, child) {
		return this.content
		     ? this.content.replaceChild(replace, child) || this.parent(replace, child)
		     : this.parent(replace, child);
	},

	/**
	 * Removes a child child.
	 *
	 * This method will attempt to remove the child from this view's content
	 * child first then from the view itself if the former failed.
	 *
	 * @see EventDispatcher#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChild: function(child) {
		return this.content
		     ? this.content.removeChild(child) || this.parent(child)
		     : this.parent(child);
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
	 * This method will set the child that is used as the content of this
	 * view. This child will contains all child entities except ones in this
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
	 * This method will return the child that is used as the content of this
	 * view. This child will contains all child entities except ones in this
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

	}

});

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
Moobile.View.at = function(path) {

	var element = Element.at(path);
	if (element) {
		return Moobile.Component.create(Moobile.View, element, 'data-view');
	}

	return null;
};

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('view', null, function(element) {
	var instance = Moobile.Component.create(Moobile.View, element, 'data-view');
	this.addChild(instance);
});
