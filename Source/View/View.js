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
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willBuild: function() {

		this.parent();

		this.element.addClass('view');

		var content = this.element.getRoleElement('view-content');
		if (content === null) {
			content = new Element('div');
			content.ingest(this.element);
			content.inject(this.element);
			content.setRole('view-content');
		}
	},

	didBuild: function() {

		this.parent();

		var classes = this.element.get('class');
		if (classes) {
			classes.split(' ').each(function(klass) {
				klass = klass.trim();
				if (klass) this.content.addClass(klass + '-content');
			}, this);
		}
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
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
	addChild: function(component, where) {
		if (where === 'header') return this.parent(component, 'top');
		if (where === 'footer') return this.parent(component, 'bottom');
		return this.addChildInside(component, this.content, where);
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

		if (this.content === content)
			return this;

		if (this.content === null) {
			this.element.grab(content);
			this.content = content;
		} else {
			content.replaces(this.content);
			this.content.destroy();
			this.content = content;
		}

		this.content.addClass('view-content');

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
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChild: function(component) {
		this.parent(component);
		component.setParentView(this);
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChild: function(component) {
		this.parent(component);
		component.setParentView(null);
	}

});

Class.refactor(Moobile.Component, {

	/**
	 * @hidden
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_parentView: null,

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#setParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setParentView: function(parentView) {

		if (this._parentView === parentView)
			return this;

		this.parentViewWillChange(parentView);
		this._parentView = parentView;
		this.parentViewDidChange(parentView);

		this._children.invoke('setParentView', parentView);

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#getParentView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParentView: function() {
		return this._parentView;
	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewWillChange: function(parentView) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/Component/Component#parentViewDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewDidChange: function(parentView) {

	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChild: function(component) {
		this.previous(component);
		component.setParentView(this._parentView);
	},

	/**
	 * @overrides
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChild: function(component) {
		this.previous(component);
		component.setParentView(null);
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

Moobile.Component.defineRole('view-content', Moobile.View, {traversable: true,	behavior: function(element) {
	this.setContent(element);
}});
